import type { Request, Response } from "express";
import { Movie } from "../models/Movie.js";
import { Slot } from "../models/Slot.js";
import { Auditorium } from "../models/Auditorium.js";
import mongoose from "mongoose";
import { deleteFromCloudinary, extractPublicId } from "../config/cloudinary.js";

// =============================
// Add movie
// =============================
export const addMovie = async (req: Request, res: Response) => {
  try {
    console.log("=== DEBUG: Raw Request Body ===");
    console.log("Body:", req.body);
    console.log("Files:", req.files);

    let data: any = { ...req.body };

    // إذا كانت البيانات تأتي في حقل movieData كـ JSON string
    if (data.movieData && typeof data.movieData === "string") {
      try {
        console.log("Parsing movieData:", data.movieData);
        const parsedData = JSON.parse(data.movieData);
        console.log("Parsed movieData:", parsedData);
        data = { ...data, ...parsedData };
        delete data.movieData; // إزالة الحقل المؤقت
      } catch (parseError) {
        console.error("Error parsing movieData:", parseError);
        return res
          .status(400)
          .json({ statusMsg: "fail", error: "Invalid movieData format" });
      }
    }

    console.log("=== DEBUG: Final Data Object ===");
    console.log("Final data:", {
      title: data.title,
      description: data.description,
      duration: data.duration,
      language: data.language,
      year: data.year,
      trailer: data.trailer,
    });

    // Handle file uploads - الآن files هو array بدلاً من object
    const files = (req as any).files as any[];
    let fileMap: { [key: string]: any[] } = {};

    if (files && Array.isArray(files)) {
      // تجميع الملفات حسب الاسم
      fileMap = {};

      files.forEach((file) => {
        const fieldName = file.fieldname;
        if (!fileMap[fieldName]) {
          fileMap[fieldName] = [];
        }
        fileMap[fieldName].push(file);
      });

      console.log("📁 File Map created:", Object.keys(fileMap));

      // Handle poster
      if (fileMap.poster && fileMap.poster[0]) {
        data.poster = fileMap.poster[0].path; // Cloudinary URL
        console.log("✅ Poster uploaded:", data.poster);
      }

      // Handle gallery images
      if (fileMap.gallery && fileMap.gallery.length > 0) {
        data.gallery = fileMap.gallery.map((file: any) => file.path);
        console.log("✅ Gallery uploaded:", data.gallery.length, "images");
      }
    }

    // Parse complex fields that come as JSON strings
    const jsonFields = [
      "directors",
      "writers",
      "cast",
      "producers",
      "singers",
      "trailer",
      "genres",
    ];

    jsonFields.forEach((field) => {
      if (data[field]) {
        try {
          // If it's already an object/array, keep it as is
          if (typeof data[field] === "object") {
            // Already parsed
          } else {
            // Try to parse if it's a string
            data[field] = JSON.parse(data[field]);
          }
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
          data[field] = [];
        }
      } else {
        // Set default values for missing fields
        if (field === "slots") {
          data[field] = undefined;
        } else {
          data[field] = [];
        }
      }
    });

    // Handle person images - match uploaded images to person data
    const personImageFields = [
      "directors",
      "cast",
      "writers",
      "producers",
      "singers",
    ];

    // تجميع الملفات حسب الاسم (نكرر العملية هنا)
    const fileMapLocal: { [key: string]: any[] } = {};
    if (files && Array.isArray(files)) {
      files.forEach((file) => {
        const fieldName = file.fieldname;
        if (!fileMapLocal[fieldName]) {
          fileMapLocal[fieldName] = [];
        }
        fileMapLocal[fieldName].push(file);
      });
    }

    personImageFields.forEach((field) => {
      if (
        data[field] &&
        Array.isArray(data[field]) &&
        fileMapLocal &&
        fileMapLocal[`${field}Images`]
      ) {
        const images = fileMapLocal[`${field}Images`];
        console.log(
          `🎭 Processing ${field} images:`,
          images?.length || 0,
          "images found"
        );

        if (images) {
          data[field].forEach((person: any, index: number) => {
            if (images[index]) {
              person.image = images[index].path;
              console.log(
                `✅ ${field}[${index}] (${person.name}): ${images[index].path}`
              );
            } else {
              console.log(
                `⚠️ ${field}[${index}] (${person.name}): No image uploaded`
              );
            }
          });
        }
      } else {
        console.log(`ℹ️ No images uploaded for ${field}`);
      }
    });

    // Fix trailer - convert empty array to null
    if (
      data.trailer &&
      Array.isArray(data.trailer) &&
      data.trailer.length === 0
    ) {
      data.trailer = null;
    }

    // Convert string numbers to actual numbers
    const numberFields = [
      "duration",
      "rating",
      "year",
      "budget",
      "boxOffice",
      "rottenTomatoesScore",
    ];
    numberFields.forEach((field) => {
      if (data[field] && typeof data[field] === "string") {
        const numValue = parseFloat(data[field]);
        if (!isNaN(numValue)) {
          data[field] = numValue;
        }
      }
    });

    // Convert string booleans
    const booleanFields = ["isActive", "featured"];
    booleanFields.forEach((field) => {
      if (data[field] && typeof data[field] === "string") {
        data[field] = data[field].toLowerCase() === "true";
      }
    });

    // Convert releaseDate
    if (data.releaseDate && typeof data.releaseDate === "string") {
      data.releaseDate = new Date(data.releaseDate);
    }

    // Set default empty arrays for slots and auditoriums
    data.slots = [];
    data.auditoriums = [];

    const movie = await Movie.create(data);
    const populatedMovie = await Movie.findById((movie as any)._id).populate(
      "auditoriums"
    );
    res.status(201).json({ statusMsg: "success", movie: populatedMovie });
  } catch (err: any) {
    console.error("Error creating movie:", err);
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
      .populate("auditoriums", "name type facilities location isActive")
      .populate({
        path: "slots",
        match: { isActive: true },
        options: { sort: { date: 1, time: 1 } },
        populate: { path: "auditorium", select: "name type" },
      })
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
    const movie = await Movie.findById(req.params.id)
      .populate({
        path: "slots",
        match: { isActive: true },
        options: { sort: { date: 1, time: 1 } },
        populate: { path: "auditorium" },
      })
      .populate("auditoriums");

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
    if (!movie)
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "Movie not found" });

    const data: any = { ...req.body };
    const files = (req as any).files;

    // Handle file uploads
    if (files) {
      // Handle poster
      if (files.poster && files.poster[0]) {
        // Delete old poster from Cloudinary
        if (movie.poster) {
          try {
            const publicId = extractPublicId(movie.poster);
            await deleteFromCloudinary(publicId);
          } catch (error) {
            console.error("Error deleting old poster from Cloudinary:", error);
          }
        }
        data.poster = files.poster[0].path;
      }

      // Handle gallery images (append to existing)
      if (files.gallery && Array.isArray(files.gallery)) {
        const newGalleryImages = files.gallery.map((file: any) => file.path);
        data.gallery = [...(movie.gallery || []), ...newGalleryImages];
      }

      // Handle person images
      const personImageFields = [
        "directors",
        "cast",
        "writers",
        "producers",
        "singers",
      ];
      personImageFields.forEach((field) => {
        if (files[`${field}Images`] && Array.isArray(files[`${field}Images`])) {
          // We'll handle this after parsing the main data
        }
      });
    }

    // Parse complex fields that come as JSON strings
    const jsonFields = [
      "directors",
      "writers",
      "cast",
      "producers",
      "singers",
      "trailer",
      "genres",
    ];

    jsonFields.forEach((field) => {
      if (data[field]) {
        try {
          // If it's already an object/array, keep it as is
          if (typeof data[field] === "object") {
            // Already parsed
          } else {
            // Try to parse if it's a string
            data[field] = JSON.parse(data[field]);
          }
        } catch (error) {
          console.error(`Error parsing ${field}:`, error);
          if (field === "slots") {
            data[field] = undefined;
          } else {
            data[field] = [];
          }
        }
      }
    });

    // Handle person images - match uploaded images to person data
    const personImageFields = [
      "directors",
      "cast",
      "writers",
      "producers",
      "singers",
    ];

    // تجميع الملفات حسب الاسم (نكرر العملية هنا)
    const fileMapLocal: { [key: string]: any[] } = {};
    if (files && Array.isArray(files)) {
      files.forEach((file) => {
        const fieldName = file.fieldname;
        if (!fileMapLocal[fieldName]) {
          fileMapLocal[fieldName] = [];
        }
        fileMapLocal[fieldName].push(file);
      });
    }

    personImageFields.forEach((field) => {
      if (
        data[field] &&
        Array.isArray(data[field]) &&
        fileMapLocal &&
        fileMapLocal[`${field}Images`]
      ) {
        const images = fileMapLocal[`${field}Images`];
        console.log(
          `🎭 Processing ${field} images:`,
          images?.length || 0,
          "images found"
        );

        if (images) {
          data[field].forEach((person: any, index: number) => {
            if (images[index]) {
              person.image = images[index].path;
              console.log(
                `✅ ${field}[${index}] (${person.name}): ${images[index].path}`
              );
            } else {
              console.log(
                `⚠️ ${field}[${index}] (${person.name}): No image uploaded`
              );
            }
          });
        }
      } else {
        console.log(`ℹ️ No images uploaded for ${field}`);
      }
    });

    // Fix trailer - convert empty array to null
    if (
      data.trailer &&
      Array.isArray(data.trailer) &&
      data.trailer.length === 0
    ) {
      data.trailer = null;
    }

    // Convert string numbers to actual numbers
    const numberFields = [
      "duration",
      "rating",
      "year",
      "budget",
      "boxOffice",
      "rottenTomatoesScore",
    ];
    numberFields.forEach((field) => {
      if (data[field] && typeof data[field] === "string") {
        const numValue = parseFloat(data[field]);
        if (!isNaN(numValue)) {
          data[field] = numValue;
        }
      }
    });

    // Convert string booleans
    const booleanFields = ["isActive", "featured"];
    booleanFields.forEach((field) => {
      if (data[field] && typeof data[field] === "string") {
        data[field] = data[field].toLowerCase() === "true";
      }
    });

    // Convert releaseDate
    if (data.releaseDate && typeof data.releaseDate === "string") {
      data.releaseDate = new Date(data.releaseDate);
    }

    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, data, {
      new: true,
    }).populate("auditoriums");
    res.status(200).json({ statusMsg: "success", updatedMovie });
  } catch (err: any) {
    console.error("Error updating movie:", err);
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
      .populate("auditoriums", "name type facilities location isActive")
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
// Get All Genres
// =============================
export const getAllGenres = async (req: Request, res: Response) => {
  try {
    const genres = await Movie.distinct("genres", { isActive: true });
    res.status(200).json({ statusMsg: "success", genres });
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
      .populate("auditoriums", "name type facilities location isActive")
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
      .populate("auditoriums", "name type facilities location isActive")
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
      .populate("auditoriums", "name type facilities location isActive")
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
      .populate("auditoriums", "name type facilities location isActive")
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
      .populate("auditoriums", "name type facilities location isActive")
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
      .populate("auditoriums", "name type facilities location isActive")
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

    // Find slots on the target date and populate their movies
    const slots = await Slot.find({
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
      isActive: true,
    })
      .populate({
        path: "movie",
        match: { isActive: true },
        select: "title poster description rating duration category",
      })
      .populate("auditorium", "name type facilities location isActive")
      .sort({ "movie.title": 1 });

    // Group slots by movie
    const movieMap: any = {};

    slots.forEach((slot: any) => {
      if (!slot.movie) return; // Skip if movie was filtered out

      const movieId = slot.movie._id.toString();

      if (!movieMap[movieId]) {
        movieMap[movieId] = {
          id: slot.movie._id,
          title: slot.movie.title,
          poster: slot.movie.poster,
          description: slot.movie.description,
          rating: slot.movie.rating,
          duration: slot.movie.duration,
          category: slot.movie.category,
          schedule: {},
        };
      }

      // Group slots by auditorium
      const auditoriumName = slot.auditorium?.name || "Auditorium 1";
      if (!movieMap[movieId].schedule[auditoriumName]) {
        movieMap[movieId].schedule[auditoriumName] = [];
      }

      movieMap[movieId].schedule[auditoriumName].push({
        time: slot.time,
        ampm: slot.ampm,
        availableSeats: slot.availableSeats,
        totalSeats: slot.totalSeats,
        seatTypes: slot.seatTypes,
      });
    });

    const todaysMovies = Object.values(movieMap);

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

    const slot = await Slot.findById(slotId)
      .populate("auditorium")
      .populate({
        path: "movie",
        select: "title auditoriums",
        populate: { path: "auditoriums", select: "name type" },
      });
    if (!slot) {
      return res
        .status(404)
        .json({ statusMsg: "fail", message: "Showtime slot not found" });
    }

    // التحقق من أن الـ slot ينتمي للفيلم المطلوب
    const slotMovieId = (slot as any).movie._id.toString();
    if (slotMovieId !== movieId) {
      return res.status(403).json({
        statusMsg: "fail",
        message: "Slot does not belong to this movie",
      });
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
        movieTitle: (slot as any).movie.title,
        showtime: `${slot.time} ${slot.ampm}`,
        date: slot.date,
        auditorium:
          slot.auditorium ||
          (slot as any).movie.auditoriums?.[0] ||
          "Auditorium 1",
        seatTypes: seatLayout,
      },
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// =============================
// إدارة الـ Slots (Showtimes)
// =============================

// إضافة slot جديد لفيلم معين
