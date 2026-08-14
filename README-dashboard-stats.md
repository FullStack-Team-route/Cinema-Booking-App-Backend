# Dashboard Statistics API

## Endpoint: GET /api/admin/dashboard-stats

### Description
Fetches comprehensive admin dashboard statistics including bookings, revenue, users, and movies along with detailed analytics.

### Authentication
- Requires **JWT Token** in the Authorization header.
- Requires **Admin** privileges.

### Request Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Response Format
```json
{
  "statusMsg": "success",
  "data": {
    "totalBookings": 150,
    "totalRevenue": 45000,
    "totalUsers": 200,
    "totalMovies": 25,
    "bookingsByStatus": {
      "confirmed": 120,
      "pending": 20,
      "cancelled": 8,
      "refunded": 2
    },
    "recentBookingsCount": 45,
    "recentBookings": [...],
    "userAnalytics": {
      "newUsers": {
        "last7Days": 12,
        "last30Days": 45
      },
      "activeUsersCount": 89,
      "registrationTrends": [...]
    },
    "bookingAnalytics": {
      "averageBookingValue": 125.50,
      "totalSeatsBooked": 450,
      "peakBookingTimes": [
        { "hour": 20, "count": 45 },
        { "hour": 18, "count": 38 },
        { "hour": 19, "count": 32 }
      ],
      "occupancyRateByShowtime": [
        {
          "showtime": "8:00 PM",
          "totalBookings": 25,
          "totalSeatsBooked": 89,
          "avgSeatsPerBooking": 3.6
        }
      ]
    },
    "topMoviesAnalytics": {
      "mostBookedMovies": [
        {
          "movieId": "64f123abc",
          "movieTitle": "Avengers: Endgame",
          "moviePoster": "https://...",
          "totalBookings": 45,
          "totalRevenue": 6750,
          "totalSeats": 135
        }
      ],
      "moviesByRevenue": [
        {
          "movieId": "64f123def",
          "movieTitle": "Spider-Man: No Way Home",
          "moviePoster": "https://...",
          "totalRevenue": 8500,
          "totalBookings": 34
        }
      ],
      "moviesByOccupancyRate": [
        {
          "movieId": "64f123ghi",
          "movieTitle": "Black Panther",
          "moviePoster": "https://...",
          "totalBookings": 28,
          "totalSeatsBooked": 98,
          "showtimeCount": 5,
          "occupancyRate": 5.6
        }
      ]
    },
    "revenueAnalytics": {
      "dailyRevenue": [
        {
          "date": "2024-12-01",
          "revenue": 2500,
          "bookings": 20
        },
        {
          "date": "2024-12-02",
          "revenue": 3200,
          "bookings": 25
        }
      ],
      "weeklyRevenue": [
        {
          "week": "2024-W48",
          "revenue": 18500,
          "bookings": 147
        },
        {
          "week": "2024-W49",
          "revenue": 21200,
          "bookings": 168
        }
      ],
      "monthlyRevenue": [
        {
          "month": "2024-11",
          "revenue": 78500,
          "bookings": 623
        },
        {
          "month": "2024-12",
          "revenue": 89200,
          "bookings": 712
        }
      ],
      "revenueTrends": [
        {
          "date": "2024-09-15",
          "revenue": 1800,
          "bookings": 14
        },
        {
          "date": "2024-09-16",
          "revenue": 2200,
          "bookings": 18
        }
      ]
    },
    "movieGenreAnalytics": {
      "genrePerformance": [
        {
          "genre": "Action",
          "totalRevenue": 45600,
          "totalBookings": 228,
          "totalSeats": 684,
          "movieCount": 12,
          "avgRevenuePerBooking": 200.00
        },
        {
          "genre": "Drama",
          "totalRevenue": 32100,
          "totalBookings": 214,
          "totalSeats": 642,
          "movieCount": 15,
          "avgRevenuePerBooking": 150.00
        },
        {
          "genre": "Comedy",
          "totalRevenue": 28900,
          "totalBookings": 193,
          "totalSeats": 579,
          "movieCount": 8,
          "avgRevenuePerBooking": 149.74
        }
      ]
    },
    "recentActivity": {
      "recentBookings": [...],
      "recentUserRegistrations": [...],
      "recentMovieAdditions": [...]
    }
  }
}
```

## Detailed Statistics

### 1. Basic Statistics
- **totalBookings**: Total number of bookings in the system.
- **totalRevenue**: Total revenue from confirmed bookings only.
- **totalUsers**: Total number of registered users.
- **totalMovies**: Total number of movies in the system.

### 2. Booking Analytics
- **bookingsByStatus**: Distribution of bookings by status.
  - `confirmed`: Completed and paid bookings.
  - `pending`: Bookings awaiting confirmation.
  - `cancelled`: Cancelled bookings.
  - `refunded`: Refunded bookings.
- **recentBookingsCount**: Number of bookings in the last 30 days.
- **recentBookings**: Last 10 bookings in the last 7 days with brief details.

### 3. User Analytics
- **newUsers.last7Days**: New users in the last 7 days.
- **newUsers.last30Days**: New users in the last 30 days.
- **activeUsersCount**: Active users (who made bookings in the last 30 days).
- **registrationTrends**: Monthly registration trends for the last 12 months.

### 4. Detailed Booking Analytics
- **bookingAnalytics.averageBookingValue**: Average value for confirmed bookings.
- **bookingAnalytics.totalSeatsBooked**: Total number of booked seats.
- **bookingAnalytics.peakBookingTimes**: Distribution of bookings by hours of the day.
- **bookingAnalytics.occupancyRateByShowtime**: Occupancy rate for the top 10 most popular showtimes.

### 5. Top Movies Analytics
- **topMoviesAnalytics.mostBookedMovies**: Most booked movies (by booking count).
- **topMoviesAnalytics.moviesByRevenue**: Movies by generated revenue.
- **topMoviesAnalytics.moviesByOccupancyRate**: Movies by occupancy rate.

### 6. Revenue Analytics
- **revenueAnalytics.dailyRevenue**: Daily revenue for the last 30 days.
- **revenueAnalytics.weeklyRevenue**: Weekly revenue for the last 12 weeks.
- **revenueAnalytics.monthlyRevenue**: Monthly revenue for the last 12 months.
- **revenueAnalytics.revenueTrends**: Daily revenue trends for the last 90 days.

### 7. Movie Genre Analytics
- **movieGenreAnalytics.genrePerformance**: Performance of each movie genre (Revenue, Bookings, Seats, Movie count).

### 8. Recent Activity
- **recentActivity.recentBookings**: Last 10 bookings in the last 7 days with customer and movie details.
- **recentActivity.recentUserRegistrations**: Last 10 registered users with name, email, and role.
- **recentActivity.recentMovieAdditions**: Last 10 added movies with title, genre, and rating.

## Usage Example

### JavaScript (Frontend)
```javascript
const fetchDashboardStats = async () => {
  try {
    const response = await fetch('/api/admin/dashboard-stats', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.statusMsg === 'success') {
      const stats = data.data;

      // Display stats
      console.log('Total Bookings:', stats.totalBookings);
      console.log('Total Revenue:', stats.totalRevenue);
      console.log('Confirmed Bookings:', stats.bookingsByStatus.confirmed);
      console.log('New Users this week:', stats.userAnalytics.newUsers.last7Days);
    }
  } catch (error) {
    console.error('Error fetching statistics:', error);
  }
};
```

### Postman
```
Method: GET
URL: http://localhost:5000/api/admin/dashboard-stats
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  Content-Type: application/json
```

## Performance and Optimizations

### Used Indexes
- `User.createdAt` - For temporal queries.
- `Booking.createdAt` - For recent bookings.
- `Booking.status` - For aggregation by status.
- `Booking.userId` - For active users.

### Performance Improvements
- All queries run in parallel using `Promise.all`.
- Use of `lean()` for read-only queries.
- Data aggregation using MongoDB Aggregation Pipeline.

### Future Enhancements
- Add Redis caching to reduce response time.
- Add custom temporal filtering (week, month, year).
- Add detailed statistics for the most viewed movies.

## Potential Error Codes

### 401 Unauthorized
```json
{
  "message": "Not authorized"
}
```
**Cause:** Missing JWT token or invalid token.

### 403 Forbidden
```json
{
  "message": "Access denied - Admin role required"
}
```
**Cause:** User is not an admin.

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```
**Cause:** Database error or server issue.

## Important Notes

1. **Revenue**: Calculated only from confirmed bookings (`status: 'confirmed'`).
2. **Active Users**: A user is considered active if they made a booking in the last 30 days.
3. **Temporal Values**: Uses the server's local time.
4. **Performance**: With large datasets, the query might take a few seconds.

## Development and Maintenance

To add new statistics:
1. Add the query to the `Promise.all` section.
2. Add the result to the `stats` object.
3. Update this documentation.

To improve performance:
1. Add new indexes as needed.
2. Use caching for static queries.
3. Monitor database performance regularly.
