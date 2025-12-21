import type { Request, Response } from "express";
import { Movie } from "../models/Movie.js";
import { deleteFromCloudinary, extractPublicId } from "../config/cloudinary.js";

// =============================
// Add movie
// =============================
export const addMovie = async (req: Request, res: Response) => {
  try {
    const data: any = req.body;

    // convert Json string to object

    const fieldsToParse = [
      "directors",
      "writers",
      "cast",
      "producers",
      "singers",
      "slots",
      "trailer",
      "genres",
      "auditoriums",
    ];

    fieldsToParse.forEach((field) => {
      if (data[field]) {
        try {
          data[field] = JSON.parse(data[field]);
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
          data[field] = [];
        }
      }
    });

    // adding poster
    const file = (req as any).file;
    if (file) data.poster = file.path; // Cloudinary URL

    // Calculate total seats and available seats for each slot
    if (data.slots && Array.isArray(data.slots)) {
      data.slots.forEach((slot: any) => {
        if (slot.seatTypes && Array.isArray(slot.seatTypes)) {
          const totalSeats = slot.seatTypes.reduce(
            (sum: number, seatType: any) => sum + (seatType.totalSeats || 0),
            0
          );
          const availableSeats = slot.seatTypes.reduce(
            (sum: number, seatType: any) =>
              sum + (seatType.availableSeats || 0),
            0
          );

          slot.totalSeats = totalSeats;
          slot.availableSeats = availableSeats;
        }
      });
    }

    const movie = await Movie.create(data);
    res.status(201).json({ statusMsg: "success", movie });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Get paginated movies
// =============================
export const getAllMovies = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type } = req.query as any;
    const filter: any = {};
    if (type) filter.type = type;
    const movies = await Movie.find(filter)
      .skip((+page - 1) * +limit)
      .limit(+limit)
      .sort({ createdAt: -1 });

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res
      .status(200)
      .json({ statusMsg: "success", page, totalPages, total, movies });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Get specific movie by ID
// =============================
export const getSpecificMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "Movie not found" });
    }

    res.status(200).json({ statusMsg: "success", movie });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Update movie
// =============================
export const updateMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    const data: any = req.body;
    const file = (req as any).file;

    if (file && movie.poster) {
      // Delete old image from Cloudinary
      try {
        const publicId = extractPublicId(movie.poster);
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
      }
      data.poster = file.path; // New Cloudinary URL
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, data, {
      new: true,
    });
    res.status(200).json({ statusMsg: "success", updatedMovie });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Delete movie
// =============================
export const deleteMovie = async (req: Request, res: Response) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: "Movie not found" });

    if (movie.poster) {
      // Delete image from Cloudinary
      try {
        const publicId = extractPublicId(movie.poster);
        await deleteFromCloudinary(publicId);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
      }
    }

    await Movie.findByIdAndDelete(req.params.id);
    res
      .status(200)
      .json({ statusMsg: "success", message: "Movie deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Advanced Movie Search - البحث المتقدم الشامل
// =============================
export const searchMovies = async (req: Request, res: Response) => {
  try {
    const {
      q, // بحث عام في العنوان والوصف
      title, // بحث بالعنوان بالضبط
      genre, // تصنيف واحد
      genres, // تصنيفات متعددة (مفصولة بفاصلة)
      year, // سنة محددة
      yearFrom, // من سنة
      yearTo, // إلى سنة
      rating, // تقييم أعلى من
      ratingMin, // تقييم أدنى
      ratingMax, // تقييم أقصى
      director, // اسم المخرج
      actor, // اسم الممثل
      language, // اللغة
      country, // الدولة
      category, // الفئة (now-showing, coming-soon, featured)
      sortBy = "createdAt", // ترتيب حسب
      sortOrder = "desc", // اتجاه الترتيب
      page = 1,
      limit = 10,
    } = req.query as any;

    const filter: any = {};

    // البحث النصي العام
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { shortDescription: { $regex: q, $options: "i" } },
      ];
    }

    // البحث بالعنوان بالضبط
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // البحث بالتصنيفات
    if (genre) {
      filter.genres = { $in: [genre] };
    }
    if (genres) {
      const genreArray = genres
        .split(",")
        .map((g: string) => g.trim())
        .filter((g: string) => g && g.length > 0);
      if (genreArray.length > 0) {
        filter.genres = { $in: genreArray };
      }
    }

    // فلاتر السنة
    if (year) {
      const yearNum = parseInt(year as string, 10);
      if (!isNaN(yearNum)) {
        filter.year = yearNum;
      }
    }
    if (yearFrom || yearTo) {
      filter.year = {};
      if (yearFrom) {
        const yearFromNum = parseInt(yearFrom as string, 10);
        if (!isNaN(yearFromNum)) {
          filter.year.$gte = yearFromNum;
        }
      }
      if (yearTo) {
        const yearToNum = parseInt(yearTo as string, 10);
        if (!isNaN(yearToNum)) {
          filter.year.$lte = yearToNum;
        }
      }
    }

    // فلاتر التقييم
    if (rating) {
      const ratingNum = parseFloat(rating as string);
      if (!isNaN(ratingNum)) {
        filter.rating = { $gte: ratingNum };
      }
    }
    if (ratingMin || ratingMax) {
      filter.rating = {};
      if (ratingMin) {
        const ratingMinNum = parseFloat(ratingMin as string);
        if (!isNaN(ratingMinNum)) {
          filter.rating.$gte = ratingMinNum;
        }
      }
      if (ratingMax) {
        const ratingMaxNum = parseFloat(ratingMax as string);
        if (!isNaN(ratingMaxNum)) {
          filter.rating.$lte = ratingMaxNum;
        }
      }
    }

    // البحث بالمخرج
    if (director) {
      filter.directors = {
        $elemMatch: { name: { $regex: director, $options: "i" } },
      };
    }

    // البحث بالممثل
    if (actor) {
      filter.cast = {
        $elemMatch: { name: { $regex: actor, $options: "i" } },
      };
    }

    // اللغة والدولة
    if (language) {
      filter.language = { $regex: language, $options: "i" };
    }
    if (country) {
      filter.country = { $regex: country, $options: "i" };
    }

    // الفئة
    if (category) {
      filter.category = category;
    }

    // الترتيب
    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const movies = await Movie.find(filter)
      .sort(sortOptions)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      page: +page,
      limit: +limit,
      total,
      totalPages,
      movies,
      filters: {
        applied: Object.keys(filter).length > 0,
        searchQuery: q,
        genre,
        genres,
        year,
        yearFrom,
        yearTo,
        rating,
        ratingMin,
        ratingMax,
        director,
        actor,
        language,
        country,
        category,
      },
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// البحث بالتصنيف - Genre Search
// =============================
export const getMoviesByGenre = async (req: Request, res: Response) => {
  try {
    const { genre } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "rating",
      sortOrder = "desc",
    } = req.query as any;

    if (!genre || typeof genre !== "string") {
      return res
        .status(400)
        .json({ statusMsg: "fail", error: "Genre parameter is required" });
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const movies = await Movie.find({
      genres: { $in: [genre] },
      isActive: true,
    })
      .sort(sortOptions)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments({
      genres: { $in: [genre] },
      isActive: true,
    });
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      genre,
      page: +page,
      limit: +limit,
      total,
      totalPages,
      movies,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// البحث بالسنة - Year Search
// =============================
export const getMoviesByYear = async (req: Request, res: Response) => {
  try {
    const { year } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "rating",
      sortOrder = "desc",
    } = req.query as any;

    if (!year || typeof year !== "string") {
      return res
        .status(400)
        .json({ statusMsg: "fail", error: "Year parameter is required" });
    }

    const yearNum = parseInt(year, 10);
    if (isNaN(yearNum)) {
      return res
        .status(400)
        .json({ statusMsg: "fail", error: "Invalid year parameter" });
    }

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const movies = await Movie.find({
      year: yearNum,
      isActive: true,
    })
      .sort(sortOptions)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments({ year: yearNum, isActive: true });
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      year: yearNum,
      page: +page,
      limit: +limit,
      total,
      totalPages,
      movies,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// أفضل الأفلام تقييماً - Top Rated Movies
// =============================
export const getTopRatedMovies = async (req: Request, res: Response) => {
  try {
    const { limit = 10, minRating = 7.0, page = 1 } = req.query as any;

    const minRatingNum = parseFloat(minRating as string);
    if (isNaN(minRatingNum)) {
      return res
        .status(400)
        .json({ statusMsg: "fail", error: "Invalid minRating parameter" });
    }

    const filter = { rating: { $gte: minRatingNum }, isActive: true };

    const movies = await Movie.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      page: +page,
      limit: +limit,
      total,
      totalPages,
      movies,
      count: movies.length,
      minRating: minRatingNum,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// البحث بالشخص (ممثل/مخرج/كاتب) - Person Search
// =============================
export const getMoviesByPerson = async (req: Request, res: Response) => {
  try {
    const { name, role = "cast" } = req.params; // cast, directors, writers, producers
    const {
      page = 1,
      limit = 10,
      sortBy = "year",
      sortOrder = "desc",
    } = req.query as any;

    const sortOptions: any = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const filter: any = {};
    filter[role] = {
      $elemMatch: { name: { $regex: name, $options: "i" } },
    };
    filter.isActive = true;

    const movies = await Movie.find(filter)
      .sort(sortOptions)
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      person: name,
      role,
      page: +page,
      limit: +limit,
      total,
      totalPages,
      movies,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// الأفلام المميزة - Featured Movies
// =============================
export const getFeaturedMovies = async (req: Request, res: Response) => {
  try {
    const { category, featured, limit = 10, page = 1 } = req.query as any;

    const filter: any = {
      isActive: true,
    };

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    // Filter by featured status if provided (true/false)
    if (featured !== undefined) {
      filter.featured = featured === "true";
    }

    // If no category or featured filter specified, get all featured movies
    if (!category && featured === undefined) {
      filter.featured = true;
    }

    const movies = await Movie.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      category: category || "all",
      featured: featured !== undefined ? featured === "true" : "all",
      page: +page,
      limit: +limit,
      total,
      totalPages,
      movies,
      count: movies.length,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// الاقتراحات التلقائية - Auto Complete
// =============================
export const searchAutoComplete = async (req: Request, res: Response) => {
  try {
    const { q, limit = 5 } = req.query as any;

    if (!q || q.length < 2) {
      return res.status(200).json({
        statusMsg: "success",
        data: { suggestions: [] },
      });
    }

    // البحث في العناوين
    const titleMatches = await Movie.find({
      title: { $regex: `^${q}`, $options: "i" },
      isActive: true,
    })
      .select("title _id")
      .limit(+limit);

    // البحث في التصنيفات
    const genreMatches = await Movie.distinct("genres", {
      genres: { $regex: q, $options: "i" },
      isActive: true,
    });

    // البحث في أسماء الممثلين
    const castMatches = await Movie.distinct("cast.name", {
      "cast.name": { $regex: `^${q}`, $options: "i" },
      isActive: true,
    });

    const suggestions = {
      movies: titleMatches.map((m) => ({
        id: m._id,
        title: m.title,
        type: "movie",
      })),
      genres: genreMatches
        .slice(0, +limit)
        .map((g) => ({ name: g, type: "genre" })),
      actors: castMatches
        .slice(0, +limit)
        .map((a) => ({ name: a, type: "actor" })),
    };

    res.status(200).json({
      statusMsg: "success",
      data: { suggestions },
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// أحدث الـ Trailers - Latest Trailers
// =============================
export const getLatestTrailers = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1 } = req.query as any;

    // Filter movies that have trailers and are active
    const filter: any = {
      isActive: true,
      "trailer.url": { $exists: true, $ne: null },
    };

    const movies = await Movie.find(filter)
      .select(
        "title description poster genres year duration releaseDate trailer directors producers cast singers"
      )
      .sort({ releaseDate: -1, createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Movie.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      page: +page,
      limit: +limit,
      total,
      totalPages,
      trailers: movies,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Get Movies Schedule by Date (Today's Movies with Showtimes)
// =============================
export const getMoviesByDate = async (req: Request, res: Response) => {
  try {
    const { date } = req.query as any;

    // Default to today if no date provided
    const targetDate = date ? new Date(date) : new Date();

    // Set time to start of day for accurate comparison
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Find movies with slots on the target date
    const movies = await Movie.find({
      isActive: true,
      "slots.date": {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    })
      .select(
        "title poster description rating duration category slots auditoriums"
      )
      .sort({ title: 1 })
      .lean();

    // Process movies to include only today's slots
    const todaysMovies = movies.map((movie: any) => {
      const movieObj = movie;

      // Filter slots for today only
      const todaysSlots = movieObj.slots.filter((slot: any) => {
        const slotDate = new Date(slot.date);
        return slotDate >= startOfDay && slotDate <= endOfDay;
      });

      // Group slots by auditorium (use auditoriums array from movie)
      const scheduleByAuditorium: any = {};
      todaysSlots.forEach((slot: any, index: number) => {
        // Use auditorium from movie's auditoriums array or default
        const auditoriumName =
          movieObj.auditoriums?.[index] ||
          movieObj.auditoriums?.[0] ||
          "Auditorium 1";
        if (!scheduleByAuditorium[auditoriumName]) {
          scheduleByAuditorium[auditoriumName] = [];
        }
        scheduleByAuditorium[auditoriumName].push({
          time: slot.time,
          ampm: slot.ampm,
          price: slot.price,
          availableSeats: slot.availableSeats,
          totalSeats: slot.totalSeats,
        });
      });

      return {
        id: movieObj._id,
        title: movieObj.title,
        poster: movieObj.poster,
        description: movieObj.description,
        rating: movieObj.rating,
        duration: movieObj.duration,
        category: movieObj.category,
        schedule: scheduleByAuditorium,
      };
    });

    res.status(200).json({
      statusMsg: "success",
      date: targetDate.toISOString().split("T")[0],
      totalMovies: todaysMovies.length,
      movies: todaysMovies,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// Get Seat Layout for Booking
// =============================
export const getSeatLayout = async (req: Request, res: Response) => {
  try {
    const { movieId, slotId } = req.params;

    if (!movieId || !slotId) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Movie ID and Slot ID are required",
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "Movie not found" });
    }

    const slot = movie.slots.id(slotId);
    if (!slot) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "Showtime slot not found" });
    }

    // Generate seat layout for each type
    const seatLayout = (slot as any).seatTypes.map((seatType: any) => {
      const bookedSeatsForType = (slot as any).bookedSeats
        .filter((booked: any) => booked.seatType === seatType.type)
        .map((booked: any) => booked.seatId);

      // Generate available seat IDs (this is a simplified example)
      // In real implementation, you'd have predefined seat arrangements
      const availableSeats = [];
      for (let row = 1; row <= Math.ceil(seatType.availableSeats / 10); row++) {
        for (
          let col = 1;
          col <= 10 && availableSeats.length < seatType.availableSeats;
          col++
        ) {
          const seatId = `${seatType.type.charAt(0)}${row}${String.fromCharCode(
            64 + col
          )}`;
          if (!bookedSeatsForType.includes(seatId)) {
            availableSeats.push(seatId);
          }
        }
      }

      return {
        type: seatType.type,
        label: seatType.label,
        price: seatType.price,
        totalSeats: seatType.totalSeats,
        availableSeats: availableSeats,
        bookedSeats: bookedSeatsForType,
      };
    });

    res.status(200).json({
      statusMsg: "success",
      seatLayout: {
        movieId,
        slotId,
        movieTitle: movie.title,
        showtime: `${slot.time} ${slot.ampm}`,
        date: slot.date,
        auditorium: movie.auditoriums?.[0] || "Auditorium 1",
        seatTypes: seatLayout,
      },
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};
