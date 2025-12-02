# Cloudinary Setup for Image Uploads

## Prerequisites

1. Create a Cloudinary account at https://cloudinary.com
2. Get your cloud name, API key, and API secret from the dashboard

## Environment Variables

Add these to your `.env` file:

```env
# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## How it works

- Images are uploaded to Cloudinary automatically when creating/updating movies
- Images are optimized and served via CDN
- Old images are automatically deleted when replaced
- Images are deleted from Cloudinary when movies are deleted

## Image Settings

- Folder: `cinema-booking/movies`
- Max dimensions: 1000x1000px
- Auto quality optimization
- Supports multiple formats (jpg, png, webp, etc.)

## API Changes

The poster field now contains full Cloudinary URLs instead of local paths:

- Before: `"/uploads/poster-123456.png"`
- After: `"https://res.cloudinary.com/your-cloud/image/upload/v123/poster-123456.png"`

No frontend changes needed - URLs work the same way!
