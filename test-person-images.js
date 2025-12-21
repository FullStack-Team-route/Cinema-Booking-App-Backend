/**
 * 🧪 اختبار رفع صور الأشخاص إلى Cloudinary
 * يمكنك تشغيل هذا الملف لاختبار أن النظام يعمل
 */

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const path = require('path')

// بيانات تجريبية للاختبار
const testMovieData = {
  title: 'Test Movie - Person Images',
  originalTitle: 'Test Movie - Person Images',
  description:
    'This is a test movie to verify person image uploads to Cloudinary.',
  shortDescription: 'Test movie for person images',
  duration: 120,
  language: 'English',
  country: 'USA',
  year: 2024,
  releaseDate: '2024-12-19',
  ageRating: 'PG-13',
  category: 'now-showing',

  // أشخاص مع صور
  directors: [
    {
      name: 'Test Director',
      role: 'Director',
      image: null, // سيتم تعبئتها من Cloudinary
    },
  ],

  cast: [
    {
      name: 'Test Actor 1',
      role: 'Lead Actor',
      image: null,
    },
    {
      name: 'Test Actor 2',
      role: 'Supporting Actor',
      image: null,
    },
  ],

  writers: [],
  producers: [],
  singers: [],
  genres: ['Test', 'Demo'],
}

// مسارات الصور (غيرها حسب الصور المتاحة لديك)
const testImagePaths = {
  poster: null, // './test-images/poster.jpg'
  gallery: [],
  directorsImages: [
    // './test-images/director.jpg'
  ],
  castImages: [
    // './test-images/actor1.jpg',
    // './test-images/actor2.jpg'
  ],
  writersImages: [],
  producersImages: [],
  singersImages: [],
}

/**
 * اختبار رفع صور الأشخاص
 */
async function testPersonImages() {
  console.log('🧪 بدء اختبار رفع صور الأشخاص إلى Cloudinary...\n')

  const formData = new FormData()

  // تحويل البيانات إلى JSON
  const movieJson = {
    ...testMovieData,
    duration: parseInt(testMovieData.duration),
    year: parseInt(testMovieData.year),
    releaseDate: new Date(testMovieData.releaseDate).toISOString(),
    directors: testMovieData.directors.filter((d) => d.name),
    cast: testMovieData.cast.filter((c) => c.name),
    writers: testMovieData.writers.filter((w) => w.name),
    producers: testMovieData.producers.filter((p) => p.name),
    singers: testMovieData.singers.filter((s) => s.name),
    genres: testMovieData.genres,
  }

  formData.append('movieData', JSON.stringify(movieJson))

  // إضافة الصور (إذا كانت موجودة)
  console.log('📸 إضافة الصور...')

  // أضف صوراً تجريبية هنا إذا كانت متوفرة
  // مثال:
  // if (fs.existsSync('./test-images/director.jpg')) {
  //   formData.append('directorsImages', fs.createReadStream('./test-images/director.jpg'));
  //   console.log('✅ تم إضافة صورة المخرج');
  // }

  // if (fs.existsSync('./test-images/actor1.jpg')) {
  //   formData.append('castImages', fs.createReadStream('./test-images/actor1.jpg'));
  //   console.log('✅ تم إضافة صورة الممثل 1');
  // }

  // إذا لم تكن هناك صور، سنرسل بدون صور لاختبار البيانات الأساسية
  console.log('⚠️ لا توجد صور تجريبية، سيتم إرسال البيانات بدون صور')

  try {
    const token = process.env.JWT_TOKEN || 'your-jwt-token-here'

    console.log('🚀 إرسال الطلب...')

    const response = await axios.post(
      'http://localhost:5000/api/movies/addMovie',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    )

    console.log('✅ تم إضافة الفيلم بنجاح!')
    console.log('📄 تفاصيل الفيلم:', JSON.stringify(response.data, null, 2))

    if (response.data.data) {
      console.log('\n👥 فحص صور الأشخاص:')

      // فحص المخرجين
      if (
        response.data.data.directors &&
        response.data.data.directors.length > 0
      ) {
        console.log('🎬 المخرجين:')
        response.data.data.directors.forEach((director, index) => {
          console.log(
            `  ${index + 1}. ${director.name}: ${
              director.image || 'لا توجد صورة'
            }`
          )
        })
      }

      // فحص الممثلين
      if (response.data.data.cast && response.data.data.cast.length > 0) {
        console.log('🎭 الممثلين:')
        response.data.data.cast.forEach((actor, index) => {
          console.log(
            `  ${index + 1}. ${actor.name}: ${actor.image || 'لا توجد صورة'}`
          )
        })
      }
    }
  } catch (error) {
    console.error('❌ فشل في إضافة الفيلم:')
    if (error.response) {
      console.error('Status:', error.response.status)
      console.error('Data:', error.response.data)
    } else {
      console.error('Error:', error.message)
    }
  }
}

/**
 * إنشاء مجلد الصور التجريبية
 */
function createTestImagesFolder() {
  const testImagesPath = path.join(__dirname, 'test-images')

  if (!fs.existsSync(testImagesPath)) {
    fs.mkdirSync(testImagesPath, { recursive: true })
    console.log('📁 تم إنشاء مجلد test-images')
    console.log('💡 ضع الصور التجريبية في هذا المجلد:')
    console.log('   - poster.jpg')
    console.log('   - director.jpg')
    console.log('   - actor1.jpg')
    console.log('   - actor2.jpg')
  } else {
    console.log('📁 مجلد test-images موجود')
  }
}

/**
 * فحص المتطلبات
 */
function checkRequirements() {
  console.log('🔍 فحص المتطلبات...\n')

  const issues = []

  // فحص التوكن
  if (!process.env.JWT_TOKEN) {
    issues.push('⚠️ متغير البيئة JWT_TOKEN غير محدد - استخدم توكن صحيح')
  }

  // فحص المجلد
  const testImagesPath = path.join(__dirname, 'test-images')
  if (!fs.existsSync(testImagesPath)) {
    issues.push('⚠️ مجلد test-images غير موجود')
  }

  // فحص الصور
  const requiredImages = ['poster.jpg', 'director.jpg', 'actor1.jpg']
  const missingImages = []

  requiredImages.forEach((imageName) => {
    const imagePath = path.join(testImagesPath, imageName)
    if (!fs.existsSync(imagePath)) {
      missingImages.push(imageName)
    }
  })

  if (missingImages.length > 0) {
    issues.push(`⚠️ الصور التالية مفقودة: ${missingImages.join(', ')}`)
  }

  if (issues.length === 0) {
    console.log('✅ جميع المتطلبات متوفرة')
  } else {
    console.log('⚠️ مشاكل محتملة:')
    issues.forEach((issue) => console.log(`   ${issue}`))
  }

  console.log('')
  return issues.length === 0
}

// تشغيل الاختبار
async function runTest() {
  console.log('🎭 اختبار رفع صور الأشخاص إلى Cloudinary\n')
  console.log('='.repeat(50))

  // إنشاء مجلد الصور
  createTestImagesFolder()
  console.log('')

  // فحص المتطلبات
  const requirementsOk = checkRequirements()

  if (!requirementsOk) {
    console.log('💡 لتشغيل الاختبار الكامل، تأكد من:')
    console.log('   1. وجود توكن صحيح في JWT_TOKEN')
    console.log('   2. وجود الصور في مجلد test-images')
    console.log('   3. تشغيل الخادم على localhost:5000')
    console.log('')
  }

  // تشغيل الاختبار
  await testPersonImages()
}

// تشغيل الاختبار إذا تم استدعاء الملف مباشرة
if (require.main === module) {
  runTest()
}

module.exports = {
  testPersonImages,
  createTestImagesFolder,
  checkRequirements,
  testMovieData,
  testImagePaths,
}
