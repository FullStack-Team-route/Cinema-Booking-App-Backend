# Dashboard Statistics API

## Endpoint: GET /api/admin/dashboard-stats

### Description
يحصل على إحصائيات شاملة للوحة تحكم الإدارة تشمل الحجوزات، الإيرادات، المستخدمين، والأفلام مع تحليلات مفصلة.

### Authentication
- يتطلب **JWT Token** في الـ Authorization header
- يتطلب صلاحيات **Admin** فقط

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

## إحصائيات مفصلة

### 1. الإحصائيات الأساسية
- **totalBookings**: إجمالي عدد الحجوزات في النظام
- **totalRevenue**: إجمالي الإيرادات من الحجوزات المؤكدة فقط
- **totalUsers**: إجمالي عدد المستخدمين المسجلين
- **totalMovies**: إجمالي عدد الأفلام في النظام

### 2. تحليل الحجوزات
- **bookingsByStatus**: توزيع الحجوزات حسب الحالة
  - `confirmed`: حجوزات مكتملة ومدفوعة
  - `pending`: حجوزات في انتظار التأكيد
  - `cancelled`: حجوزات ملغاة
  - `refunded`: حجوزات مستردة
- **recentBookingsCount**: عدد الحجوزات في آخر 30 يوم
- **recentBookings**: آخر 10 حجوزات في آخر 7 أيام مع تفاصيل مختصرة

### 3. تحليل المستخدمين
- **newUsers.last7Days**: مستخدمين جدد في آخر 7 أيام
- **newUsers.last30Days**: مستخدمين جدد في آخر 30 يوم
- **activeUsersCount**: مستخدمين نشطين (قاموا بحجوزات في آخر 30 يوم)
- **registrationTrends**: اتجاهات التسجيل الشهرية لآخر 12 شهر

### 4. تحليل الحجوزات (Booking Analytics)
- **bookingAnalytics.averageBookingValue**: متوسط قيمة الحجز للحجوزات المؤكدة
- **bookingAnalytics.totalSeatsBooked**: إجمالي عدد المقاعد المحجوزة
- **bookingAnalytics.peakBookingTimes**: توزيع الحجوزات حسب ساعات اليوم
- **bookingAnalytics.occupancyRateByShowtime**: معدل الإشغال لأكثر 10 أوقات عرض شعبية

### 5. إحصائيات الأفلام الأكثر شعبية (Top Movies Analytics)
- **topMoviesAnalytics.mostBookedMovies**: الأفلام الأكثر حجزاً (عدد الحجوزات)
- **topMoviesAnalytics.moviesByRevenue**: الأفلام حسب الإيرادات المولدة
- **topMoviesAnalytics.moviesByOccupancyRate**: الأفلام حسب معدل الإشغال

### 6. تحليل الإيرادات (Revenue Analytics)
- **revenueAnalytics.dailyRevenue**: الإيرادات اليومية لآخر 30 يوم
- **revenueAnalytics.weeklyRevenue**: الإيرادات الأسبوعية لآخر 12 أسبوع
- **revenueAnalytics.monthlyRevenue**: الإيرادات الشهرية لآخر 12 شهر
- **revenueAnalytics.revenueTrends**: اتجاهات الإيرادات اليومية لآخر 90 يوم

### 7. تحليل تصنيفات الأفلام (Movie Genre Analytics)
- **movieGenreAnalytics.genrePerformance**: أداء كل تصنيف فيلم (الإيرادات، الحجوزات، المقاعد، عدد الأفلام)

### 8. النشاط الحديث (Recent Activity)
- **recentActivity.recentBookings**: آخر 10 حجوزات في آخر 7 أيام مع تفاصيل العميل والفيلم
- **recentActivity.recentUserRegistrations**: آخر 10 مستخدمين مسجلين مع الاسم والبريد والدور
- **recentActivity.recentMovieAdditions**: آخر 10 أفلام مضافة مع العنوان والتصنيف والتقييم

### 4. نشاط حديث (Recent Activity)
- **recentActivity.recentBookings**: آخر 10 حجوزات في آخر 7 أيام
- **recentActivity.recentUserRegistrations**: آخر 10 مستخدمين مسجلين
- **recentActivity.recentMovieAdditions**: آخر 10 أفلام مضافة

## مثال على الاستخدام

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

      // عرض الإحصائيات
      console.log('إجمالي الحجوزات:', stats.totalBookings);
      console.log('إجمالي الإيرادات:', stats.totalRevenue);
      console.log('حجوزات مؤكدة:', stats.bookingsByStatus.confirmed);
      console.log('مستخدمين جدد هذا الأسبوع:', stats.userAnalytics.newUsers.last7Days);
    }
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
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

## أداء وتحسينات

### Indexes المستخدمة
- `User.createdAt` - للاستعلامات الزمنية
- `Booking.createdAt` - للحجوزات الأخيرة
- `Booking.status` - للتجميع حسب الحالة
- `Booking.userId` - للمستخدمين النشطين

### تحسينات الأداء
- جميع الاستعلامات تعمل بشكل متوازي باستخدام `Promise.all`
- استخدام `lean()` للاستعلامات غير المعدلة
- تجميع البيانات باستخدام MongoDB Aggregation Pipeline

### إضافات مستقبلية
- إضافة caching بـ Redis لتقليل وقت الاستجابة
- إضافة فلترة زمنية مخصصة (أسبوع، شهر، سنة)
- إضافة إحصائيات تفصيلية للأفلام الأكثر مشاهدة

## خطوط الخطأ المحتملة

### 401 Unauthorized
```json
{
  "message": "Not authorized"
}
```
**السبب:** عدم وجود JWT token أو token غير صحيح

### 403 Forbidden
```json
{
  "message": "Access denied - Admin role required"
}
```
**السبب:** المستخدم ليس admin

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```
**السبب:** خطأ في قاعدة البيانات أو مشكلة في السيرفر

## ملاحظات مهمة

1. **الإيرادات**: تحسب فقط من الحجوزات المؤكدة (`status: 'confirmed'`)
2. **المستخدمين النشطين**: يُعتبر المستخدم نشط إذا قام بحجز في آخر 30 يوم
3. **الأرقام الزمنية**: تستخدم التوقيت المحلي للخادم
4. **الأداء**: مع البيانات الكبيرة، قد يستغرق الاستعلام عدة ثوان

## تطوير وصيانة

لإضافة إحصائيات جديدة:
1. أضف الاستعلام في قسم `Promise.all`
2. أضف النتيجة في object `stats`
3. حدث التوثيق هذا

لتحسين الأداء:
1. أضف indexes جديدة حسب الحاجة
2. استخدم caching للاستعلامات الثابتة
3. راقب أداء قاعدة البيانات بانتظام
