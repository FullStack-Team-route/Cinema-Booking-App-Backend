# 🎬 Cinema Booking System

> **نظام شامل لحجز تذاكر السينما مع لوحة إدارة متقدمة**

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7+-blue.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5+-black.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![Stripe](https://img.shields.io/badge/Stripe-Payments-635bff.svg)](https://stripe.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000.svg)](https://jwt.io/)

## 📋 نظرة عامة

نظام شامل لحجز تذاكر السينما مبني باستخدام **MERN Stack** مع التركيز على الأمان والأداء العالي. يوفر تجربة متكاملة للمستخدمين والإدارة مع لوحة تحكم تحليلية متقدمة.

## ✨ المميزات الرئيسية

### 👥 نظام المصادقة والمستخدمين

- ✅ تسجيل وتسجيل دخول آمن مع JWT
- ✅ إدارة البروفايل والتحقق من البريد الإلكتروني
- ✅ إعادة تعيين كلمة المرور مع OTP
- ✅ نظام أدوار (User/Admin)
- ✅ Rate Limiting للحماية من الهجمات

### 🎭 إدارة الأفلام

- ✅ CRUD كامل للأفلام مع رفع الصور
- ✅ إدارة التصنيفات والعروض والقاعات
- ✅ بحث وفلترة متقدمة (نوع، تصنيف، سنة، تقييم، مخرج، ممثل)
- ✅ دعم المقاطع الدعائية والتريلرز
- ✅ إدارة حالة الفيلم (معروض، قادم قريباً، مميز)

### 🎫 نظام الحجوزات المتقدم

- ✅ حجز المقاعد التفاعلي مع أنواع مختلفة (VIP، Regular، Premium)
- ✅ أسعار مرنة لكل نوع كرسي
- ✅ دفع آمن عبر Stripe
- ✅ تأكيد فوري للحجز والدفع
- ✅ إدارة حالة الحجز (معلق، مؤكد، ملغي، مسترد)
- ✅ منع الازدواج في حجز المقاعد
- ✅ إرسال تأكيدات عبر البريد الإلكتروني

### 📊 لوحة الإدارة التحليلية

- ✅ إحصائيات شاملة (الحجوزات، الإيرادات، المستخدمين، الأفلام)
- ✅ تحليل المستخدمين (جدد، نشطين، اتجاهات التسجيل)
- ✅ تحليل الحجوزات (متوسط القيمة، المقاعد المحجوزة، أوقات الذروة)
- ✅ تحليل الإيرادات (يومي، أسبوعي، شهري، اتجاهات)
- ✅ تحليل الأفلام (الأكثر حجزاً، الإيرادات، معدل الإشغال)
- ✅ تحليل التصنيفات (أداء كل نوع فيلم)
- ✅ النشاط الحديث (حجوزات، مستخدمين، أفلام جديدة)

### 🔒 الأمان والأداء

- ✅ JWT Authentication مع HttpOnly Cookies
- ✅ Rate Limiting لجميع الطلبات
- ✅ Input Validation و Sanitization
- ✅ CORS Configuration
- ✅ Protection من SQL Injection و XSS
- ✅ Encryption للبيانات الحساسة

### 📧 نظام الإشعارات

- ✅ إرسال OTP للتحقق من البريد الإلكتروني
- ✅ تأكيدات الحجز والدفع
- ✅ إشعارات إلغاء الحجز
- ✅ Templates جميلة ومتجاوبة

## 🛠️ التقنيات المستخدمة

### Backend

- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Type Safety
- **JWT** - Authentication
- **Bcrypt** - Password Hashing
- **Stripe** - Payment Processing
- **Nodemailer** - Email Service
- **Multer** - File Upload
- **Express Rate Limit** - Rate Limiting
- **Express Validator** - Input Validation

### DevOps & Tools

- **Nodemon** - Development Server
- **TSX** - TypeScript Execution
- **Dotenv** - Environment Variables
- **CORS** - Cross-Origin Resource Sharing

## 🚀 البدء السريع

### متطلبات النظام

- Node.js 18+
- MongoDB 7+
- Git

### التثبيت

```bash
# استنساخ المشروع
git clone https://github.com/your-username/cinema-booking-system.git
cd cinema-booking-system/backend

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
```

### إعداد متغيرات البيئة

```env
# Database
MONGODB_URI=mongodb://localhost:27017/cinema-booking

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Email (Gmail)
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
EMAIL_FROM=Cinema Booking <your-email@gmail.com>

# Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=300
LOGIN_RATE_LIMIT_WINDOW_MS=900000
LOGIN_RATE_LIMIT_MAX=10
FORGOT_RATE_LIMIT_WINDOW_MS=3600000
FORGOT_RATE_LIMIT_MAX=5
```

### تشغيل المشروع

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📚 API Documentation

### المسارات الرئيسية

#### 🔐 Authentication Routes (`/api/auth`)

- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/logout` - تسجيل الخروج
- `GET /api/auth/current-user` - جلب بيانات المستخدم الحالي
- `POST /api/auth/forgot-password` - طلب إعادة تعيين كلمة المرور
- `POST /api/auth/verify-otp` - التحقق من OTP
- `POST /api/auth/reset-password` - إعادة تعيين كلمة المرور

#### 🎬 Movies Routes (`/api/movies`)

- `GET /api/movies/allMovies` - جلب جميع الأفلام مع ترقيم الصفحات
- `POST /api/movies/addMovie` - إضافة فيلم جديد (Admin)
- `PUT /api/movies/updateMovie/:id` - تحديث فيلم (Admin)
- `DELETE /api/movies/deleteMovie/:id` - حذف فيلم (Admin)
- `GET /api/movies/getSpecificMovie/:id` - جلب تفاصيل فيلم محدد
- `GET /api/movies/search` - بحث متقدم في الأفلام
- `GET /api/movies/genre/:genre` - الأفلام حسب التصنيف
- `GET /api/movies/year/:year` - الأفلام حسب السنة
- `GET /api/movies/person/:name/:role` - الأفلام حسب الشخص
- `GET /api/movies/top-rated` - أفضل الأفلام تقييماً
- `GET /api/movies/featured` - الأفلام المميزة
- `GET /api/movies/autocomplete` - اقتراحات البحث
- `GET /api/movies/latest-trailers` - أحدث المقاطع الدعائية
- `GET /api/movies/by-date?date=YYYY-MM-DD` - جدولة الأفلام حسب التاريخ
- `GET /api/movies/seat-layout/:movieId/:slotId` - تخطيط المقاعد للحجز
- `GET /api/movies/seat-layout/:movieId/:slotId` - تخطيط المقاعد للحجز

#### 🎫 Booking Routes (`/api/bookings`)

- `POST /api/bookings/addBooking` - إنشاء حجز جديد
- `GET /api/bookings/allBookings` - جلب جميع الحجوزات (Admin with pagination)
- `GET /api/bookings/userBookings/:userId` - حجوزات مستخدم محدد
- `PUT /api/bookings/updateBookings/:bookingId` - تحديث حجز
- `PUT /api/bookings/confirmBookings/:bookingId` - تأكيد حجز
- `PUT /api/bookings/cancelBookings/:bookingId` - إلغاء حجز
- `PUT /api/bookings/priceBookings/:bookingId` - تحديث سعر التذكرة

#### 📊 Admin Routes (`/api/admin`)

- `GET /api/admin/dashboard-stats` - إحصائيات لوحة التحكم

## 🗄️ Database Schema

### User Schema

```typescript
{
  fullName: String,
  username: String (unique),
  email: String (unique),
  phoneNumber: String,
  birthDate: Date,
  password: String (hashed),
  role: "user" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Movie Schema

```typescript
{
  title: String,
  originalTitle: String,
  description: String,
  shortDescription: String,
  poster: String,
  trailer: {
    url: String,
    thumbnail: String,
    duration: Number
  },
  genres: [String],
  year: Number,
  rating: Number (0-10),
  duration: Number,
  directors: [PersonSchema],
  cast: [PersonSchema],
  slots: [SlotSchema],
  auditoriums: [String],
  category: "now-showing" | "coming-soon" | "featured",
  isActive: Boolean,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Schema

```typescript
{
  movieId: ObjectId,
  userId: ObjectId,
  customer: String,
  movie: {
    id: ObjectId,
    title: String,
    poster: String,
    rating: Number
  },
  showtime: String,
  auditorium: String,
  seats: [String],
  totalPrice: Number,
  status: "pending" | "confirmed" | "cancelled" | "refunded",
  bookingReference: String,
  paymentId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

## 💺 نظام أنواع الكراسي المتقدم

**نظام مرن لأنواع الكراسي** - يدعم أسعار مختلفة لكل نوع (VIP، Regular، Premium):

### مميزات النظام:

- **أنواع كراسي متعددة**: VIP، Regular، Premium مع أسعار مختلفة
- **إدارة دقيقة للمقاعد**: عدد محدود لكل نوع
- **عرض تفاعلي**: Seat Layout API لعرض المقاعد المتاحة
- **حجز ذكي**: منع الحجز المزدوج وحساب السعر التلقائي
- **إدارة تلقائية**: حساب إجمالي المقاعد والمتاحة من seatTypes

### مثال على البيانات:

```json
{
  "seatTypes": [
    {
      "type": "VIP",
      "price": 250,
      "totalSeats": 50,
      "availableSeats": 45,
      "label": "VIP Section - Front Rows"
    },
    {
      "type": "Regular",
      "price": 150,
      "totalSeats": 100,
      "availableSeats": 87,
      "label": "Regular Seats"
    },
    {
      "type": "Premium",
      "price": 200,
      "totalSeats": 30,
      "availableSeats": 28,
      "label": "Premium Seats - Middle Rows"
    }
  ],
  "totalSeats": 180, // محسوب تلقائياً
  "availableSeats": 160 // محسوب تلقائياً
}
```

---

## 📅 جدولة الأفلام اليومية

**Movies by Date API** - يعرض الأفلام المعروضة في تاريخ محدد مع مواعيدها والقاعات:

#### استخدام:

```javascript
// جلب أفلام اليوم
GET /api/movies/by-date

// جلب أفلام تاريخ محدد
GET /api/movies/by-date?date=2024-12-15
```

#### Response مثال:

```json
{
  "statusMsg": "success",
  "date": "2024-12-10",
  "totalMovies": 3,
  "movies": [
    {
      "id": "...",
      "title": "Avengers: Endgame",
      "poster": "https://...",
      "rating": 8.4,
      "schedule": {
        "Auditorium 1": [
          {
            "time": "14:30",
            "ampm": "PM",
            "price": 150,
            "availableSeats": 45,
            "totalSeats": 100
          }
        ]
      }
    }
  ]
}
```

---

## 🎫 Seat Layout API

**عرض تفاعلي للمقاعد** - يظهر المقاعد المتاحة والمحجوزة لكل عرض:

#### استخدام:

```javascript
GET / api / movies / seat - layout / { movieId } / { slotId };
```

#### Response مثال:

```json
{
  "statusMsg": "success",
  "seatLayout": {
    "movieId": "...",
    "slotId": "...",
    "movieTitle": "Avengers: Endgame",
    "showtime": "14:30 PM",
    "date": "2024-12-15T00:00:00.000Z",
    "auditorium": "Auditorium 1",
    "seatTypes": [
      {
        "type": "VIP",
        "label": "VIP Section - Front Rows",
        "price": 250,
        "totalSeats": 50,
        "availableSeats": ["V1A1", "V1A2", "V1A3", ...],
        "bookedSeats": ["V1A5", "V1A6"]
      },
      {
        "type": "Regular",
        "label": "Regular Seats",
        "price": 150,
        "totalSeats": 100,
        "availableSeats": ["R2B1", "R2B2", "R2B3", ...],
        "bookedSeats": ["R2B5", "R2B7"]
      }
    ]
  }
}
```

---

## 🎨 لوحة الإدارة التحليلية

### الإحصائيات المتاحة:

- **الإحصائيات الأساسية**: الحجوزات، الإيرادات، المستخدمين، الأفلام
- **تحليل المستخدمين**: المستخدمين الجدد والنشطين واتجاهات التسجيل
- **تحليل الحجوزات**: متوسط القيمة، المقاعد المحجوزة، أوقات الذروة، معدل الإشغال
- **تحليل الإيرادات**: الإيرادات اليومية/أسبوعية/شهرية والاتجاهات
- **تحليل الأفلام**: الأكثر حجزاً والإيرادات ومعدل الإشغال
- **تحليل التصنيفات**: أداء كل تصنيف فيلم
- **النشاط الحديث**: آخر الحجوزات والمستخدمين والأفلام

### إعداد الإنتاج

1. **إعداد MongoDB**:

   ```bash
   # استخدم MongoDB Atlas أو قاعدة بيانات محلية
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/cinema-prod
   ```

2. **إعداد Stripe**:

   ```bash
   # احصل على مفاتيح Stripe من لوحة التحكم
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

3. **إعداد البريد الإلكتروني**:
   ```bash
   # استخدم Gmail أو خدمة بريد إلكتروني أخرى
   GMAIL_USER=admin@cinema.com
   GMAIL_APP_PASSWORD=app-specific-password
   ```

## 🎬 إضافة أفلام مع أنواع كراسي

### مثال شامل لإضافة فيلم:

```javascript
// في Postman - POST /api/movies/addMovie
// Headers: Authorization: Bearer YOUR_ADMIN_TOKEN

// Form Data Fields:
title = Avengers: Endgame
description = After the devastating events of Avengers: Infinity War...
duration = 181
rating = 8.4
year = 2019
category = now-showing
genres = ["Action", "Adventure", "Drama", "Sci-Fi"]
directors = [{"name": "Anthony Russo", "role": "Director"}]
cast = [{"name": "Robert Downey Jr.", "role": "Tony Stark"}]
auditoriums = ["Auditorium 1", "Auditorium 2"]
slots = [{"date": "2024-12-15", "time": "14:30", "ampm": "PM", "seatTypes": [{"type": "VIP", "price": 250, "totalSeats": 50, "availableSeats": 50, "label": "VIP Section"}, {"type": "Regular", "price": 150, "totalSeats": 100, "availableSeats": 100, "label": "Regular Seats"}]}]
poster = [Upload image file]
```

### ملفات جاهزة:

- `movie-data.json` - البيانات كاملة بتنسيق JSON
- `movie-formdata.txt` - البيانات جاهزة للنسخ في Postman

## 🙏 شكر وتقدير

شكراً لجميع المساهمين والمطورين الذين ساهموا في تطوير هذا النظام!

---

**Built with ❤️ for movie lovers everywhere** 🎬✨
