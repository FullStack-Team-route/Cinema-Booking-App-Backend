import Booking from "../models/Booking.js";
import { User } from "../models/User.js";
import { Movie } from "../models/Movie.js";
/**
 * Get Dashboard Statistics (Admin Only)
 */
export const getDashboardStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        // ===== BOOKING ANALYTICS QUERIES =====
        const [totalSeatsBooked, averageBookingValue, bookingsByHour, occupancyRateByShowtime, topMoviesByBookings, topMoviesByRevenue, moviesByOccupancyRate, dailyRevenue, weeklyRevenue, monthlyRevenue, revenueTrends, genrePerformance,] = await Promise.all([
            // Total seats booked (from all confirmed bookings)
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                { $group: { _id: null, totalSeats: { $sum: { $size: "$seats" } } } },
            ]),
            // Average booking value
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                { $group: { _id: null, avgValue: { $avg: "$totalPrice" } } },
            ]),
            // Peak booking times (bookings by hour of day)
            Booking.aggregate([
                {
                    $group: {
                        _id: { $hour: "$createdAt" },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1, _id: 1 } },
                {
                    $project: {
                        hour: "$_id",
                        count: 1,
                        _id: 0,
                    },
                },
            ]),
            // Occupancy rate per showtime (average seats booked per slot)
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                {
                    $group: {
                        _id: "$movie.showtime",
                        totalBookings: { $sum: 1 },
                        totalSeatsBooked: { $sum: { $size: "$seats" } },
                        avgSeatsPerBooking: { $avg: { $size: "$seats" } },
                    },
                },
                {
                    $project: {
                        showtime: "$_id",
                        totalBookings: 1,
                        totalSeatsBooked: 1,
                        avgSeatsPerBooking: { $round: ["$avgSeatsPerBooking", 1] },
                        _id: 0,
                    },
                },
                { $sort: { totalBookings: -1 } },
                { $limit: 10 }, // Top 10 showtimes
            ]),
            // Top movies by number of bookings
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                {
                    $group: {
                        _id: "$movieId",
                        movieTitle: { $first: "$movie.title" },
                        moviePoster: { $first: "$movie.poster" },
                        totalBookings: { $sum: 1 },
                        totalRevenue: { $sum: "$totalPrice" },
                        totalSeats: { $sum: { $size: "$seats" } },
                    },
                },
                {
                    $project: {
                        movieId: "$_id",
                        movieTitle: 1,
                        moviePoster: 1,
                        totalBookings: 1,
                        totalRevenue: 1,
                        totalSeats: 1,
                        _id: 0,
                    },
                },
                { $sort: { totalBookings: -1 } },
                { $limit: 10 },
            ]),
            // Top movies by revenue
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                {
                    $group: {
                        _id: "$movieId",
                        movieTitle: { $first: "$movie.title" },
                        moviePoster: { $first: "$movie.poster" },
                        totalRevenue: { $sum: "$totalPrice" },
                        totalBookings: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        movieId: "$_id",
                        movieTitle: 1,
                        moviePoster: 1,
                        totalRevenue: 1,
                        totalBookings: 1,
                        _id: 0,
                    },
                },
                { $sort: { totalRevenue: -1 } },
                { $limit: 10 },
            ]),
            // Movies by occupancy rate (bookings per available seat estimation)
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                {
                    $group: {
                        _id: "$movieId",
                        movieTitle: { $first: "$movie.title" },
                        moviePoster: { $first: "$movie.poster" },
                        totalBookings: { $sum: 1 },
                        totalSeatsBooked: { $sum: { $size: "$seats" } },
                        uniqueShowtimes: { $addToSet: "$movie.showtime" },
                    },
                },
                {
                    $project: {
                        movieId: "$_id",
                        movieTitle: 1,
                        moviePoster: 1,
                        totalBookings: 1,
                        totalSeatsBooked: 1,
                        showtimeCount: { $size: "$uniqueShowtimes" },
                        // Rough occupancy rate estimation (bookings / showtimes)
                        occupancyRate: {
                            $round: [
                                { $divide: ["$totalBookings", { $size: "$uniqueShowtimes" }] },
                                1,
                            ],
                        },
                        _id: 0,
                    },
                },
                { $match: { showtimeCount: { $gt: 0 } } }, // Avoid division by zero
                { $sort: { occupancyRate: -1 } },
                { $limit: 10 },
            ]),
            // Daily revenue (last 30 days)
            Booking.aggregate([
                {
                    $match: {
                        status: "confirmed",
                        createdAt: { $gte: thirtyDaysAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        revenue: { $sum: "$totalPrice" },
                        bookings: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        date: "$_id",
                        revenue: 1,
                        bookings: 1,
                        _id: 0,
                    },
                },
                { $sort: { date: 1 } },
            ]),
            // Weekly revenue (last 12 weeks)
            Booking.aggregate([
                {
                    $match: {
                        status: "confirmed",
                        createdAt: { $gte: twelveMonthsAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            week: { $week: "$createdAt" },
                        },
                        revenue: { $sum: "$totalPrice" },
                        bookings: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        week: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-W",
                                {
                                    $cond: {
                                        if: { $lt: ["$_id.week", 10] },
                                        then: { $concat: ["0", { $toString: "$_id.week" }] },
                                        else: { $toString: "$_id.week" },
                                    },
                                },
                            ],
                        },
                        revenue: 1,
                        bookings: 1,
                        _id: 0,
                    },
                },
                { $sort: { week: 1 } },
            ]),
            // Monthly revenue (last 12 months)
            Booking.aggregate([
                {
                    $match: {
                        status: "confirmed",
                        createdAt: { $gte: twelveMonthsAgo },
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        revenue: { $sum: "$totalPrice" },
                        bookings: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        month: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-",
                                {
                                    $cond: {
                                        if: { $lt: ["$_id.month", 10] },
                                        then: { $concat: ["0", { $toString: "$_id.month" }] },
                                        else: { $toString: "$_id.month" },
                                    },
                                },
                            ],
                        },
                        revenue: 1,
                        bookings: 1,
                        _id: 0,
                    },
                },
                { $sort: { month: 1 } },
            ]),
            // Revenue trends over time (last 90 days daily)
            Booking.aggregate([
                {
                    $match: {
                        status: "confirmed",
                        createdAt: {
                            $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                        },
                        revenue: { $sum: "$totalPrice" },
                        bookings: { $sum: 1 },
                    },
                },
                {
                    $project: {
                        date: "$_id",
                        revenue: 1,
                        bookings: 1,
                        _id: 0,
                    },
                },
                { $sort: { date: 1 } },
            ]),
            // Movie genre performance
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                {
                    $lookup: {
                        from: "movies",
                        localField: "movieId",
                        foreignField: "_id",
                        as: "movieDetails",
                    },
                },
                { $unwind: "$movieDetails" },
                { $unwind: "$movieDetails.genres" },
                {
                    $group: {
                        _id: "$movieDetails.genres",
                        totalRevenue: { $sum: "$totalPrice" },
                        totalBookings: { $sum: 1 },
                        totalSeats: { $sum: { $size: "$seats" } },
                        uniqueMovies: { $addToSet: "$movieId" },
                    },
                },
                {
                    $project: {
                        genre: "$_id",
                        totalRevenue: 1,
                        totalBookings: 1,
                        totalSeats: 1,
                        movieCount: { $size: "$uniqueMovies" },
                        avgRevenuePerBooking: {
                            $round: [{ $divide: ["$totalRevenue", "$totalBookings"] }, 2],
                        },
                        _id: 0,
                    },
                },
                { $sort: { totalRevenue: -1 } },
            ]),
        ]);
        // ===== PARALLEL QUERIES =====
        const [totalBookings, totalUsers, totalMovies, revenueResult, bookingsByStatus, recentBookingsCount, newUsersLast30Days, newUsersLast7Days, activeUsersCount, userRegistrationTrends, recentBookings, recentUserRegistrations, recentMovieAdditions, moviesByStatus,] = await Promise.all([
            // Basic counts
            Booking.countDocuments(),
            User.countDocuments(),
            Movie.countDocuments(),
            // Revenue
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
            ]),
            // Bookings by status
            Booking.aggregate([
                { $match: { status: { $ne: null, $exists: true } } },
                { $group: { _id: "$status", count: { $sum: 1 } } },
                { $project: { status: "$_id", count: 1, _id: 0 } },
            ]),
            // Recent bookings count
            Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            // User analytics
            User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
            User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
            Booking.distinct("userId", { createdAt: { $gte: thirtyDaysAgo } }).then((ids) => ids.length),
            // Registration trends
            User.aggregate([
                { $match: { createdAt: { $gte: twelveMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-",
                                {
                                    $cond: {
                                        if: { $lt: ["$_id.month", 10] },
                                        then: { $concat: ["0", { $toString: "$_id.month" }] },
                                        else: { $toString: "$_id.month" },
                                    },
                                },
                            ],
                        },
                        count: 1,
                    },
                },
            ]),
            // Recent bookings with populate
            Booking.find({ createdAt: { $gte: sevenDaysAgo } })
                .populate("userId", "fullName")
                .sort({ createdAt: -1 })
                .limit(10)
                .select("customer movie.title totalPrice status createdAt bookingReference")
                .lean(),
            // ===== RECENT ACTIVITY FEED =====
            // Recent user registrations (last 10 users)
            User.find()
                .select("fullName email username role createdAt")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            // Recent movie additions (last 10 movies)
            Movie.find()
                .select("title category poster rating createdAt")
                .sort({ createdAt: -1 })
                .limit(10)
                .lean(),
            // Movies by status/category
            Movie.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 },
                        movies: {
                            $push: {
                                id: "$_id",
                                title: "$title",
                                poster: "$poster",
                                rating: "$rating",
                                releaseDate: "$releaseDate",
                                isActive: "$isActive",
                            },
                        },
                    },
                },
                {
                    $project: {
                        status: "$_id",
                        count: 1,
                        movies: { $slice: ["$movies", 5] }, // Show up to 5 movies per category
                        _id: 0,
                    },
                },
                { $sort: { count: -1 } },
            ]),
        ]);
        // Process results
        const totalRevenue = revenueResult[0]?.totalRevenue || 0;
        const bookingsByStatusObj = bookingsByStatus.reduce((acc, curr) => {
            acc[curr.status] = curr.count;
            return acc;
        }, {});
        // Process booking analytics
        const totalSeatsBookedCount = totalSeatsBooked[0]?.totalSeats || 0;
        const averageBookingValueAmount = averageBookingValue[0]?.avgValue
            ? Math.round(averageBookingValue[0].avgValue * 100) / 100 // Round to 2 decimal places
            : 0;
        const stats = {
            totalBookings,
            totalRevenue,
            totalUsers,
            totalMovies,
            bookingsByStatus: bookingsByStatusObj,
            recentBookingsCount,
            recentBookings,
            userAnalytics: {
                newUsers: {
                    last7Days: newUsersLast7Days,
                    last30Days: newUsersLast30Days,
                },
                activeUsersCount,
                registrationTrends: userRegistrationTrends,
            },
            bookingAnalytics: {
                averageBookingValue: averageBookingValueAmount,
                totalSeatsBooked: totalSeatsBookedCount,
                peakBookingTimes: bookingsByHour,
                occupancyRateByShowtime: occupancyRateByShowtime,
            },
            topMoviesAnalytics: {
                mostBookedMovies: topMoviesByBookings,
                moviesByRevenue: topMoviesByRevenue,
                moviesByOccupancyRate: moviesByOccupancyRate,
            },
            revenueAnalytics: {
                dailyRevenue: dailyRevenue,
                weeklyRevenue: weeklyRevenue,
                monthlyRevenue: monthlyRevenue,
                revenueTrends: revenueTrends,
            },
            movieGenreAnalytics: {
                genrePerformance: genrePerformance,
            },
            recentActivity: {
                recentBookings: recentBookings,
                recentUserRegistrations: recentUserRegistrations,
                recentMovieAdditions: recentMovieAdditions,
            },
            movieStatusAnalytics: {
                moviesByStatus: moviesByStatus,
            },
        };
        return res.status(200).json({
            statusMsg: "success",
            data: stats,
        });
    }
    catch (error) {
        console.error("Dashboard stats error:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
//# sourceMappingURL=adminController.js.map