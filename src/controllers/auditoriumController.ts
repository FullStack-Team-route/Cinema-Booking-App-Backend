import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Auditorium } from "../models/Auditorium.js";
import { Movie } from "../models/Movie.js";

// إضافة قاعة جديدة
export const addAuditorium = async (req: Request, res: Response) => {
  try {
    const { name, type, facilities, location } = req.body;

    // التحقق من وجود القاعة بالفعل
    const existingAuditorium = await Auditorium.findOne({ name });
    if (existingAuditorium) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Auditorium with this name already exists",
      });
    }

    const auditorium = await Auditorium.create({
      name,
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
    const { id } = req.params;

    // التحقق من وجود ID
    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Auditorium ID is required",
      });
    }

    // التحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Invalid auditorium ID format",
      });
    }

    // البحث عن القاعة و التحقق من وجودها
    const auditorium = await Auditorium.findById(id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    // إعادة جلب القاعة مع البيانات المطلوبة
    const auditoriumWithMovies = await Auditorium.findById(id).populate(
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
    const { name, type, facilities, location, isActive } = req.body;

    // التحقق من وجود ID
    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Auditorium ID is required",
      });
    }

    // التحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Invalid auditorium ID format",
      });
    }

    // البحث عن القاعة و التحقق من وجودها
    const auditorium = await Auditorium.findById(id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    // التحقق من صحة البيانات المدخلة
    if (name !== undefined) {
      if (!name || name.trim() === "") {
        return res.status(400).json({
          statusMsg: "fail",
          message: "Auditorium name cannot be empty",
        });
      }
      if (name.length < 2) {
        return res.status(400).json({
          statusMsg: "fail",
          message: "Auditorium name must be at least 2 characters long",
        });
      }
    }

    if (type !== undefined) {
      const validTypes = ["standard", "premium", "imax", "vip"];
      if (!validTypes.includes(type)) {
        return res.status(400).json({
          statusMsg: "fail",
          message:
            "Invalid auditorium type. Must be one of: standard, premium, imax, vip",
        });
      }
    }

    if (location !== undefined) {
      if (!location || location.trim() === "") {
        return res.status(400).json({
          statusMsg: "fail",
          message: "Auditorium location cannot be empty",
        });
      }
    }

    if (facilities !== undefined) {
      if (!Array.isArray(facilities)) {
        return res.status(400).json({
          statusMsg: "fail",
          message: "Facilities must be an array of strings",
        });
      }
      // التحقق من أن جميع العناصر في المصفوفة strings
      if (
        facilities.some(
          (facility) => typeof facility !== "string" || facility.trim() === ""
        )
      ) {
        return res.status(400).json({
          statusMsg: "fail",
          message: "All facilities must be non-empty strings",
        });
      }
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        statusMsg: "fail",
        message: "isActive must be a boolean value",
      });
    }

    // التحقق من عدم وجود تغيير في الاسم إذا كانت القاعة تحتوي على slots مستقبلية
    if (name !== undefined && name !== auditorium.name) {
      const moviesWithSlots = await Movie.find({
        _id: { $in: auditorium.movies },
        "slots.date": { $gte: new Date() },
      }).select("title");

      if (moviesWithSlots.length > 0) {
        return res.status(400).json({
          statusMsg: "fail",
          message:
            "Cannot change auditorium name. There are upcoming shows scheduled",
          movies: moviesWithSlots.map((m) => m.title),
        });
      }
    }

    // تحديث الحقول المطلوبة فقط (partial update)
    if (name !== undefined) auditorium.name = name;
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

    // التحقق من وجود ID
    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Auditorium ID is required",
      });
    }

    // التحقق من صحة ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Invalid auditorium ID format",
      });
    }

    // البحث عن القاعة و التحقق من وجودها
    const auditorium = await Auditorium.findById(id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }
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
    const { id, movieId } = req.params;
    const { action } = req.body; // "add" or "remove"

    // التحقق من وجود ID للقاعة
    if (!id) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Auditorium ID is required",
      });
    }

    // التحقق من وجود ID للفيلم
    if (!movieId) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Movie ID is required",
      });
    }

    // التحقق من صحة ObjectId للقاعة
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Invalid auditorium ID format",
      });
    }

    // التحقق من صحة ObjectId للفيلم
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Invalid movie ID format",
      });
    }

    // البحث عن القاعة و التحقق من وجودها
    const auditorium = await Auditorium.findById(id);
    if (!auditorium) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Auditorium not found",
      });
    }

    // البحث عن الفيلم و التحقق من وجوده
    const movie = await Movie.findById(movieId!);
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
