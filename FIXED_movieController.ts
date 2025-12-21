// =============================
// Add movie - الإصدار المُصلح
// =============================
export const addMovie = async (req: Request, res: Response) => {
  try {
    console.log("=== استقبال طلب إضافة فيلم ===");
    console.log("البيانات النصية:", Object.keys(req.body));
    console.log("الملفات:", req.files ? (req.files as any[]).length : 0);

    // البيانات الأساسية
    let data: any = { ...req.body };

    // 1. معالجة الملفات أولاً
    const files = (req as any).files as any[];
    let fileMap: { [key: string]: any[] } = {};

    if (files && Array.isArray(files)) {
      // تجميع الملفات حسب الاسم
      files.forEach((file) => {
        const fieldName = file.fieldname;
        if (!fileMap[fieldName]) {
          fileMap[fieldName] = [];
        }
        fileMap[fieldName].push(file);
      });

      console.log("📁 تم تجميع الملفات:", Object.keys(fileMap));

      // معالجة الصورة الرئيسية
      if (fileMap.poster && fileMap.poster[0]) {
        data.poster = fileMap.poster[0].path;
        console.log("✅ صورة الفيلم:", data.poster);
      }

      // معالجة معرض الصور
      if (fileMap.gallery && fileMap.gallery.length > 0) {
        data.gallery = fileMap.gallery.map((file: any) => file.path);
        console.log("✅ معرض الصور:", data.gallery.length, "صورة");
      }
    }

    // 2. تحليل البيانات المعقدة (JSON strings)
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
          if (typeof data[field] === "string") {
            data[field] = JSON.parse(data[field]);
            console.log(
              `✅ تم تحليل ${field}:`,
              Array.isArray(data[field])
                ? data[field].length + " عنصر"
                : "موجود"
            );
          }
        } catch (error) {
          console.error(`❌ خطأ في تحليل ${field}:`, error.message);
          data[field] = [];
        }
      } else {
        data[field] = [];
      }
    });

    // 3. ربط الصور بالأشخاص
    const personFields = [
      "directors",
      "writers",
      "cast",
      "producers",
      "singers",
    ];

    personFields.forEach((field) => {
      if (data[field] && Array.isArray(data[field])) {
        const imageField = `${field}Images`;
        const images = fileMap[imageField];

        if (images && images.length > 0) {
          console.log(`🎭 معالجة صور ${field}:`, images.length, "صورة");

          data[field].forEach((person: any, index: number) => {
            if (images[index]) {
              person.image = images[index].path;
              console.log(
                `✅ ${field}[${index}] ${person.name}: ${person.image}`
              );
            } else {
              console.log(`⚠️ ${field}[${index}] ${person.name}: لا توجد صورة`);
            }
          });
        } else {
          console.log(`ℹ️ لا توجد صور مرفوعة لـ ${field}`);
        }
      }
    });

    // 4. تحويل الأنواع البيانات
    // الأرقام
    const numberFields = ["duration", "rating", "year", "budget", "boxOffice"];
    numberFields.forEach((field) => {
      if (data[field] && typeof data[field] === "string") {
        data[field] = parseFloat(data[field]) || 0;
      }
    });

    // التواريخ
    if (data.releaseDate) {
      data.releaseDate = new Date(data.releaseDate);
    }

    // البوليان
    const booleanFields = ["isActive", "featured"];
    booleanFields.forEach((field) => {
      if (typeof data[field] === "string") {
        data[field] = data[field].toLowerCase() === "true";
      }
    });

    // 5. القيم الافتراضية
    data.slots = [];
    data.auditoriums = [];
    data.isActive = data.isActive !== false; // true افتراضياً
    data.category = data.category || "now-showing";

    // إصلاح التريلر
    if (
      data.trailer &&
      Array.isArray(data.trailer) &&
      data.trailer.length === 0
    ) {
      data.trailer = null;
    }

    // 6. إنشاء الفيلم
    console.log("🚀 إنشاء الفيلم...");
    const movie = await Movie.create(data);

    console.log("✅ تم إنشاء الفيلم بنجاح:", movie._id);
    res.status(201).json({
      statusMsg: "success",
      movie,
      message: "تم إضافة الفيلم بنجاح",
    });
  } catch (error: any) {
    console.error("❌ خطأ في إضافة الفيلم:", error);
    res.status(500).json({
      statusMsg: "fail",
      error: error.message,
      message: "فشل في إضافة الفيلم",
    });
  }
};
