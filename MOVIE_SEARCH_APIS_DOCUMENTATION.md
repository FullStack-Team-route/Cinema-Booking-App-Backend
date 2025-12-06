# 🎬 نظام البحث المتقدم في الأفلام - Movie Search APIs

## 📋 نظرة عامة

تم إضافة نظام بحث متقدم يتيح البحث عن الأفلام بطرق متعددة ومرنة مع فلترة وترتيب متقدم.

## 🔍 طرق البحث المتاحة

### 1. **البحث المتقدم الشامل** - `/api/movies/search`

#### المعلمات (Query Parameters):

```javascript
{
  q: "batman",              // بحث عام في العنوان والوصف
  title: "Batman Begins",   // بحث بالعنوان بالضبط
  genre: "Action",          // تصنيف واحد
  genres: "Action,Drama",   // تصنيفات متعددة (مفصولة بفاصلة)
  year: 2024,              // سنة محددة
  yearFrom: 2020,          // من سنة
  yearTo: 2024,           // إلى سنة
  rating: 8.0,            // تقييم أعلى من
  ratingMin: 7.0,         // تقييم أدنى
  ratingMax: 9.0,         // تقييم أقصى
  director: "Christopher Nolan", // اسم المخرج
  actor: "Leonardo DiCaprio",    // اسم الممثل
  language: "English",     // اللغة
  country: "USA",          // الدولة
  category: "now-showing", // الفئة
  sortBy: "rating",        // ترتيب حسب
  sortOrder: "desc",       // اتجاه الترتيب
  page: 1,                 // رقم الصفحة
  limit: 10               // عدد النتائج لكل صفحة
}
```

#### أمثلة الاستخدام:

```bash
# بحث عام
GET /api/movies/search?q=batman&page=1&limit=5

# بحث متقدم
GET /api/movies/search?genre=Action&yearFrom=2020&ratingMin=8.0&sortBy=rating&sortOrder=desc

# بحث بالممثل
GET /api/movies/search?actor=Leonardo DiCaprio&sortBy=year&sortOrder=desc

# أفلام أمريكية عالية التقييم
GET /api/movies/search?country=USA&ratingMin=8.5&language=English
```

---

### 2. **الاقتراحات التلقائية** - `/api/movies/autocomplete`

#### المعلمات:

```javascript
{
  q: "bat",        // نص البحث (حد أدنى 2 أحرف)
  limit: 5         // عدد الاقتراحات
}
```

#### مثال:

```bash
GET /api/movies/autocomplete?q=bat&limit=3
```

#### الاستجابة:

```json
{
  "statusMsg": "success",
  "data": {
    "suggestions": {
      "movies": [{ "id": "...", "title": "Batman Begins", "type": "movie" }],
      "genres": [{ "name": "Action", "type": "genre" }],
      "actors": [{ "name": "Christian Bale", "type": "actor" }]
    }
  }
}
```

---

### 3. **البحث بالتصنيف** - `/api/movies/genre/:genre`

#### المعلمات:

```javascript
{
  sortBy: "rating",     // ترتيب حسب
  sortOrder: "desc",    // اتجاه الترتيب
  page: 1,             // رقم الصفحة
  limit: 10            // عدد النتائج
}
```

#### أمثلة:

```bash
GET /api/movies/genre/Action?sortBy=rating&sortOrder=desc
GET /api/movies/genre/Comedy?page=1&limit=20
GET /api/movies/genre/Drama?sortBy=year&sortOrder=asc
```

---

### 4. **البحث بالسنة** - `/api/movies/year/:year`

#### أمثلة:

```bash
GET /api/movies/year/2024?sortBy=rating&sortOrder=desc
GET /api/movies/year/2020?page=1&limit=15
```

---

### 5. **البحث بالشخص** - `/api/movies/person/:name/:role?`

بحث بالممثل/مخرج/كاتب/منتج

#### المعلمات:

- `name`: اسم الشخص
- `role`: cast (افتراضي), directors, writers, producers

#### أمثلة:

```bash
# أفلام ممثل (افتراضياً cast)
GET /api/movies/person/Leonardo DiCaprio

# أفلام ممثل محدد
GET /api/movies/person/Leonardo DiCaprio/cast

# أفلام مخرج
GET /api/movies/person/Christopher Nolan/directors

# أفلام كاتب
GET /api/movies/person/Quentin Tarantino/writers
```

---

### 6. **أفضل الأفلام تقييماً** - `/api/movies/top-rated`

#### المعلمات:

```javascript
{
  limit: 10,         // عدد الأفلام
  minRating: 8.0     // التقييم الأدنى
}
```

#### أمثلة:

```bash
GET /api/movies/top-rated?limit=5&minRating=8.5
GET /api/movies/top-rated?minRating=9.0
```

---

### 7. **الأفلام المميزة** - `/api/movies/featured`

#### المعلمات:

```javascript
{
  category: "featured",  // featured, now-showing, coming-soon
  limit: 10             // عدد الأفلام
}
```

#### أمثلة:

```bash
GET /api/movies/featured?category=now-showing&limit=12
GET /api/movies/featured?category=featured&limit=6
```

---

### 8. **البحث التقليدي** - `/api/movies/allMovies` (للتوافق)

#### مثال:

```bash
GET /api/movies/allMovies?page=1&limit=10&type=now-showing
```

---

## 📊 تنسيق الاستجابة

جميع APIs ترجع نفس التنسيق:

```json
{
  "statusMsg": "success",
  "data": {
    "movies": [...],           // مصفوفة الأفلام
    "pagination": {           // معلومات الصفحات
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    },
    "filters": {...},         // الفلاتر المطبقة (في البحث المتقدم)
    "genre": "...",           // في البحث بالتصنيف
    "year": 2024,            // في البحث بالسنة
    "person": "...",         // في البحث بالشخص
    "role": "..."            // في البحث بالشخص
  }
}
```

---

## 🎯 خيارات الترتيب المتاحة

- `rating` - التقييم
- `year` - السنة
- `title` - العنوان
- `createdAt` - تاريخ الإضافة
- `updatedAt` - تاريخ التحديث

## 📂 الفئات المدعومة

- `now-showing` - يُعرض الآن
- `coming-soon` - قريباً
- `featured` - مميز

---

## 🚀 أمثلة متقدمة

### البحث المركب:

```bash
# أفلام أكشن أمريكية بين 2020-2024 تقييم 8+
GET /api/movies/search?genres=Action&country=USA&yearFrom=2020&yearTo=2024&ratingMin=8&sortBy=rating&sortOrder=desc
```

### البحث بالمخرج والممثل:

```bash
# أفلام كريستوفر نولان مع ليوناردو دي كابريو
GET /api/movies/search?director=Christopher Nolan&actor=Leonardo DiCaprio
```

### البحث باللغة والتقييم:

```bash
# أفلام عربية عالية التقييم
GET /api/movies/search?language=Arabic&ratingMin=7.5&sortBy=rating
```

---

## 💡 نصائح للأداء

1. **استخدم pagination** دائماً لتجنب تحميل كميات كبيرة
2. **استخدم autocomplete** للبحث التلقائي
3. **حدد sortBy** حسب احتياجاتك
4. **استخدم APIs المتخصصة** للبحث السريع في فئات محددة

---

## 🔧 اختبار سريع

```bash
# تشغيل الخادم
npm run dev

# اختبار البحث
GET http://localhost:5000/api/movies/search?q=action
```

---

## 📈 المزايا

- ✅ **بحث مرن ومتقدم** مع فلاتر متعددة
- ✅ **اقتراحات ذكية** للبحث التلقائي
- ✅ **ترتيب متعدد** حسب أي حقل
- ✅ **pagination** للأداء الأمثل
- ✅ **بحث متخصص** لكل نوع من البيانات
- ✅ **توافق مع البحث التقليدي**
- ✅ **استجابة موحدة** عبر جميع APIs

---

**🎉 تم إنشاء نظام بحث متقدم شامل للأفلام بـ 8 طرق مختلفة!**

هل تحتاج تفاصيل إضافية عن أي API معين؟ 🤔
