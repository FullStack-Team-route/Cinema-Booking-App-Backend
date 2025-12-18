import type { Request, Response } from "express";
import { Auditorium } from "../models/Auditorium.js";
import { Movie } from "../models/Movie.js";

// إضافة قاعة جديدة
export const addAuditorium = async (req: Request, res: Response) => {
  try {
    const { name, capacity, type, facilities, location } = req.body;

    const auditorium = await Auditorium.create({
      name,
      capacity,
      type,
      facilities,
      location,
    });

    res.status(201).json({
      statusMsg: "success",
      message: "Auditorium added successfully",
      auditorium,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// جلب جميع القاعات
export const getAllAuditoriums = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, active } = req.query;

    const filter: any = {};
    if (type) filter.type = type;
    if (active !== undefined) filter.isActive = active === "true";

    const auditoriums = await Auditorium.find(filter)
      .populate("movies", "title poster")
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    const total = await Auditorium.countDocuments(filter);
    const totalPages = Math.ceil(total / +limit);

    res.status(200).json({
      statusMsg: "success",
      page: +page,
      limit: +limit,
      total,
      totalPages,
      auditoriums,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// جلب قاعة محددة
export const getAuditorium = async (req: Request, res: Response) => {
  try {
    const auditorium = await Auditorium.findById(req.params.id).populate(
      "movies",
      "title poster category"
    );

    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    res.status(200).json({
      statusMsg: "success",
      auditorium,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// تحديث قاعة
export const updateAuditorium = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, capacity, type, facilities, location, isActive } = req.body;

    // البحث عن القاعة أولاً
    const auditorium = await Auditorium.findById(id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    // تحديث الحقول المطلوبة فقط (partial update)
    if (name !== undefined) auditorium.name = name;
    if (capacity !== undefined) auditorium.capacity = capacity;
    if (type !== undefined) auditorium.type = type;
    if (facilities !== undefined) auditorium.facilities = facilities;
    if (location !== undefined) auditorium.location = location;
    if (isActive !== undefined) auditorium.isActive = isActive;

    // حفظ التحديثات
    const updatedAuditorium = await auditorium.save();

    res.status(200).json({
      statusMsg: "success",
      message: "Auditorium updated successfully",
      auditorium: updatedAuditorium,
    });
  } catch (err: any) {
    // معالجة خطأ duplicate name
    if (err.code === 11000) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Auditorium name already exists",
        error: err.message,
      });
    }
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// حذف قاعة
export const deleteAuditorium = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const auditorium = await Auditorium.findById(id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    // التحقق من عدم وجود أفلام مرتبطة بالقاعة
    if (auditorium.movies && auditorium.movies.length > 0) {
      // التحقق من وجود slots نشطة في الأفلام المرتبطة
      const moviesWithSlots = await Movie.find({
        _id: { $in: auditorium.movies },
        "slots.date": { $gte: new Date() }, // slots مستقبلية فقط
      }).select("title");

      if (moviesWithSlots.length > 0) {
        return res.status(400).json({
          statusMsg: "fail",
          message:
            "Cannot delete auditorium. There are upcoming shows scheduled in this auditorium",
          movies: moviesWithSlots.map((m) => m.title),
        });
      }

      // لو فيه أفلام بس مش فيها slots مستقبلية، ممكن نحذف
      // لكن الأفضل نخلي الـ admin يقرر - ممكن نرجع warning
    }

    // حذف القاعة
    await Auditorium.findByIdAndDelete(id);

    res.status(200).json({
      statusMsg: "success",
      message: "Auditorium deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// إضافة/إزالة فيلم من قاعة
export const manageAuditoriumMovies = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { action } = req.body; // "add" or "remove"

    const auditorium = await Auditorium.findById(req.params.id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Movie not found",
      });
    }

    const auditoriumId = auditorium._id.toString();

    if (action === "add") {
      // إضافة الفيلم للقاعة
      if (!auditorium.movies.includes(movieId as any)) {
        auditorium.movies.push(movieId as any);
        await auditorium.save();
      }

      // إضافة القاعة للفيلم (المفروض نضيفه هنا)
      if (!movie.auditoriums.includes(auditoriumId as any)) {
        movie.auditoriums.push(auditoriumId as any);
        await movie.save();
      }
    } else if (action === "remove") {
      // إزالة الفيلم من القاعة
      auditorium.movies = auditorium.movies.filter(
        (id: any) => id.toString() !== movieId
      );
      await auditorium.save();

      // إزالة القاعة من الفيلم (المفروض نضيفه هنا)
      movie.auditoriums = movie.auditoriums.filter(
        (id: any) => id.toString() !== auditoriumId
      );
      await movie.save();
    }

    res.status(200).json({
      statusMsg: "success",
      message: `Movie ${action}ed to auditorium successfully`,
      auditorium,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};
