import type { Request, Response } from "express";
import { Movie } from "../models/Movie.js";
import { Slot } from "../models/Slot.js";
import { Auditorium } from "../models/Auditorium.js";

// =============================
// Slot Management Functions
// =============================

// إضافة slot جديد لفيلم
export const addSlotToMovie = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { date, time, ampm, auditorium, seatTypes } = req.body;

    // التحقق من صحة البيانات
    if (
      !date ||
      !time ||
      !auditorium ||
      !seatTypes ||
      !Array.isArray(seatTypes)
    ) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Date, time, auditorium, and seatTypes are required",
      });
    }

    // البحث عن الفيلم
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Movie not found",
      });
    }

    // حساب إجمالي المقاعد والمقاعد المتاحة
    let totalSeats = 0;
    let availableSeats = 0;

    seatTypes.forEach((seatType: any) => {
      if (seatType.totalSeats && seatType.availableSeats) {
        totalSeats += seatType.totalSeats;
        availableSeats += seatType.availableSeats;
      }
    });

    // إنشاء الـ slot الجديد
    const newSlot = new Slot({
      movie: movieId,
      date: new Date(date),
      time,
      ampm: ampm || "PM",
      auditorium,
      seatTypes,
      totalSeats,
      availableSeats,
      bookedSeats: [],
    });

    // حفظ الـ slot
    await newSlot.save();

    // populate الـ slot مع القاعة
    await newSlot.populate("auditorium");

    res.status(201).json({
      statusMsg: "success",
      message: "Slot added successfully",
      slot: newSlot,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// تعديل slot موجود
export const updateSlot = async (req: Request, res: Response) => {
  try {
    const { movieId, slotId } = req.params;
    const { date, time, ampm, auditorium, seatTypes } = req.body;

    // التحقق من slotId
    if (!slotId) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Slot ID is required",
      });
    }

    // البحث عن الـ slot
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Slot not found",
      });
    }

    // التحقق من أن الـ slot ينتمي للفيلم المطلوب
    if (slot.movie.toString() !== movieId) {
      return res.status(403).json({
        statusMsg: "fail",
        message: "Slot does not belong to this movie",
      });
    }

    // تحديث البيانات
    if (date) {
      const newDate = new Date(date);
      if (isNaN(newDate.getTime())) {
        return res.status(400).json({
          statusMsg: "fail",
          message: "Invalid date format",
        });
      }
      slot.date = newDate;
    }
    if (time) slot.time = time;
    if (ampm) slot.ampm = ampm;
    if (auditorium) slot.auditorium = auditorium;

    // تحديث seatTypes وحساب الإجماليات
    if (seatTypes !== undefined) {
      // التحقق من أن seatTypes تم إرساله (قد يكون فارغاً)
      if (Array.isArray(seatTypes) && seatTypes.length > 0) {
        // التحقق من صحة البيانات
        for (const seatType of seatTypes) {
          if (
            !seatType.type ||
            !seatType.price ||
            !seatType.totalSeats ||
            seatType.availableSeats === undefined ||
            !seatType.label
          ) {
            return res.status(400).json({
              statusMsg: "fail",
              message:
                "Invalid seatType data. All fields (type, price, totalSeats, availableSeats, label) are required",
            });
          }
        }
        // مسح seatTypes الحالية وإضافة الجديدة
        slot.seatTypes.splice(0, slot.seatTypes.length);
        seatTypes.forEach((seatType: any) => {
          slot.seatTypes.push(seatType);
        });
      } else if (
        seatTypes === null ||
        (Array.isArray(seatTypes) && seatTypes.length === 0)
      ) {
        // إذا تم إرسال seatTypes فارغ، مسح seatTypes الحالية
        slot.seatTypes.splice(0, slot.seatTypes.length);
      }
      // إذا لم يتم إرسال seatTypes على الإطلاق، اتركه كما هو
    }

    // إعادة حساب الإجماليات دائماً من seatTypes الحالية
    // الآن نحسب الإجماليات حتى لو كانت seatTypes فارغة أو غير موجودة
    let totalSeats = 0;
    let availableSeats = 0;

    if (
      slot.seatTypes &&
      Array.isArray(slot.seatTypes) &&
      slot.seatTypes.length > 0
    ) {
      slot.seatTypes.forEach((seatType: any) => {
        if (
          seatType.totalSeats !== undefined &&
          seatType.availableSeats !== undefined
        ) {
          totalSeats += seatType.totalSeats;
          availableSeats += seatType.availableSeats;
        }
      });
    }

    // تحديث القيم المحسوبة
    slot.totalSeats = totalSeats;
    slot.availableSeats = availableSeats;

    // حفظ الـ slot
    try {
      const updatedSlot = await slot.save();

      // populate الـ slot مع القاعة
      await updatedSlot.populate("auditorium");

      res.status(200).json({
        statusMsg: "success",
        message: "Slot updated successfully",
        slot: updatedSlot,
      });
    } catch (saveError: any) {
      console.error("Error saving slot:", saveError);
      return res.status(500).json({
        statusMsg: "fail",
        message: "Error saving slot updates",
        error: saveError.message,
        slotData: {
          _id: slot._id,
          date: slot.date,
          time: slot.time,
          seatTypes: slot.seatTypes,
          totalSeats: slot.totalSeats,
          availableSeats: slot.availableSeats,
        },
      });
    }
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// حذف slot
export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const { movieId, slotId } = req.params;

    // التحقق من slotId
    if (!slotId) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Slot ID is required",
      });
    }

    // البحث عن الـ slot
    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Slot not found",
      });
    }

    // التحقق من أن الـ slot ينتمي للفيلم المطلوب
    if (slot.movie.toString() !== movieId) {
      return res.status(403).json({
        statusMsg: "fail",
        message: "Slot does not belong to this movie",
      });
    }

    // التحقق من عدم وجود حجوزات على هذا الـ slot
    if (slot.bookedSeats && slot.bookedSeats.length > 0) {
      return res.status(400).json({
        statusMsg: "fail",
        message: "Cannot delete slot with existing bookings",
      });
    }

    // حذف الـ slot
    await Slot.findByIdAndDelete(slotId);

    res.status(200).json({
      statusMsg: "success",
      message: "Slot deleted successfully",
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// Helper function لتحديد status الـ slot
const getSlotStatus = (
  slotDate: Date,
  slotTime: string,
  slotAmpm: string,
  availableSeats?: number
): string => {
  const now = new Date();
  const slotDateTime = new Date(slotDate);

  // تحويل الوقت لـ 24-hour format
  const timeParts = slotTime.split(":");
  const hoursNum = parseInt(timeParts[0] || "0", 10);
  const minutesNum = parseInt(timeParts[1] || "0", 10);

  if (isNaN(hoursNum) || isNaN(minutesNum)) {
    return "inactive"; // invalid time format
  }

  let hours = hoursNum;

  if (slotAmpm === "PM" && hours !== 12) {
    hours += 12;
  } else if (slotAmpm === "AM" && hours === 12) {
    hours = 0;
  }

  slotDateTime.setHours(hours, minutesNum, 0, 0);

  // مقارنة مع الوقت الحالي
  if (slotDateTime < now) {
    return "completed"; // انتهى
  } else {
    // الـ slot في المستقبل أو اليوم
    // نشط إذا كان فيه مقاعد متاحة
    if (availableSeats !== undefined && availableSeats > 0) {
      return "active"; // نشط ومقاعد متاحة
    } else {
      return "inactive"; // غير نشط (لا مقاعد متاحة)
    }
  }
};

// جلب جميع slots لفيلم معين
export const getMovieSlots = async (req: Request, res: Response) => {
  try {
    const { movieId } = req.params;
    const { date, page = 1, limit = 10 } = req.query;

    // البحث عن الفيلم
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({
        statusMsg: "fail",
        message: "Movie not found",
      });
    }

    // بناء query للـ slots
    let query: any = {
      movie: movieId,
      isActive: true,
    };

    // فلترة حسب التاريخ إذا تم تحديده
    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    // جلب الـ slots مع pagination
    const slots = await Slot.find(query)
      .populate("auditorium")
      .sort({ date: 1, time: 1 })
      .limit(+limit * 1)
      .skip((+page - 1) * +limit);

    const total = await Slot.countDocuments(query);

    const totalPages = Math.ceil(total / +limit);

    // إضافة status لكل slot
    const slotsWithStatus = slots.map((slot: any) => {
      const slotObj = slot.toObject ? slot.toObject() : slot;
      const slotStatus = getSlotStatus(
        new Date(slotObj.date),
        slotObj.time,
        slotObj.ampm,
        slotObj.availableSeats
      );

      return {
        ...slotObj,
        status: slotStatus,
      };
    });

    res.status(200).json({
      statusMsg: "success",
      movie: {
        id: movie._id,
        title: movie.title,
        poster: movie.poster,
        duration: movie.duration,
      },
      page: +page,
      limit: +limit,
      total,
      totalPages,
      slots: slotsWithStatus,
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// جلب جميع slots لجميع الأفلام
export const getAllSlots = async (req: Request, res: Response) => {
  try {
    const { date, page = 1, limit = 10, movieId } = req.query;

    // بناء الـ filter
    const filter: any = { isActive: true };

    // فلترة حسب تاريخ معين
    if (date) {
      const targetDate = new Date(date as string);
      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      filter.date = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // فلترة حسب فيلم معين
    if (movieId) {
      filter.movie = movieId;
    }

    // جلب الـ slots مع populate للأفلام والقاعات
    const slots = await Slot.find(filter)
      .populate({
        path: "movie",
        select: "title poster category duration isActive",
        // match: { isActive: true } // مؤقتاً نشيل الmatch عشان نشوف كل الslots
      })
      .populate("auditorium", "name type facilities location")
      .sort({ date: -1, time: -1 }) // من الأحدث للأقدم
      .lean();

    // إضافة status لكل slot
    const allSlots = slots.map((slot: any) => {
      const slotStatus = getSlotStatus(
        new Date(slot.date),
        slot.time,
        slot.ampm,
        slot.availableSeats
      );

      return {
        _id: slot._id,
        movie: slot.movie,
        auditorium: slot.auditorium,
        date: slot.date,
        time: slot.time,
        ampm: slot.ampm,
        status: slotStatus,
        totalSeats: slot.totalSeats,
        availableSeats: slot.availableSeats,
        seatTypes: slot.seatTypes,
        bookedSeatsCount: slot.bookedSeats ? slot.bookedSeats.length : 0,
      };
    });

    // فلترة الslots اللي عندها movie populated
    const slotsWithMovies = allSlots.filter((slot) => slot.movie);

    const total = slotsWithMovies.length;
    const totalPages = Math.ceil(total / +limit);

    // تقسيم الصفحات
    const startIndex = (+page - 1) * +limit;
    const endIndex = startIndex + +limit;
    const paginatedSlots = slotsWithMovies.slice(startIndex, endIndex);

    res.status(200).json({
      statusMsg: "success",
      page: +page,
      limit: +limit,
      total,
      totalPages,
      slots: paginatedSlots,
      filters: {
        date: date || null,
        movieId: movieId || null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};

// إحصائيات الـ Slots
export const getSlotsStatistics = async (req: Request, res: Response) => {
  try {
    // جلب جميع الـ slots النشطة
    const slots = await Slot.find({ isActive: true }).lean();

    // حساب تاريخ اليوم (بداية ونهاية اليوم)
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);

    // إحصائيات
    let totalShowtimes = 0;
    let activeToday = 0;
    let totalBookedSeats = 0;
    let expectedRevenue = 0;

    slots.forEach((slot: any) => {
      totalShowtimes++;

      // التحقق من إن الـ slot نشط اليوم
      const slotDate = new Date(slot.date);
      if (slotDate >= startOfToday && slotDate <= endOfToday) {
        activeToday++;
      }

      // حساب المقاعد المحجوزة
      const bookedSeatsCount = slot.bookedSeats ? slot.bookedSeats.length : 0;
      totalBookedSeats += bookedSeatsCount;

      // حساب الإيرادات المتوقعة
      if (
        slot.seatTypes &&
        Array.isArray(slot.seatTypes) &&
        bookedSeatsCount > 0
      ) {
        // حساب متوسط السعر للمقعد المحجوز
        // نستخدم bookedSeats لتحديد نوع المقعد ونحسب السعر
        if (slot.bookedSeats && Array.isArray(slot.bookedSeats)) {
          slot.bookedSeats.forEach((bookedSeat: any) => {
            // البحث عن seatType المناسب
            const seatType = slot.seatTypes.find(
              (st: any) => st.type === bookedSeat.seatType
            );
            if (seatType && seatType.price) {
              expectedRevenue += seatType.price;
            }
          });
        }
      }
    });

    res.status(200).json({
      statusMsg: "success",
      statistics: {
        totalShowtimes,
        activeToday,
        totalBookedSeats,
        expectedRevenue: Math.round(expectedRevenue * 100) / 100, // تقريب لرقمين عشريين
      },
      date: today.toISOString().split("T")[0], // تاريخ اليوم
    });
  } catch (err: any) {
    res.status(500).json({ statusMsg: "fail", error: err.message });
  }
};
