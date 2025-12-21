import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configuration
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary environment variables are not set.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Cloudinary storage for multer
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: Express.Multer.File) => {
    // تحديد المجلد حسب نوع الملف
    let folder = "cinema-booking/movies";

    // إذا كان الملف للأشخاص (directors, cast, writers, producers, singers)
    if (
      file.fieldname.includes("Images") ||
      file.fieldname.includes("images")
    ) {
      folder = "cinema-booking/people";
    }

    return {
      folder: folder, // Folder in cloudinary
      format: file.mimetype.split("/")[1], // Extract format from mimetype
      public_id: `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}`,
      transformation: [
        { width: 800, height: 800, crop: "limit" }, // Max dimensions (أصغر للأشخاص)
        { quality: "auto" }, // Auto quality
      ],
    };
  },
});

// Function to delete image from cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Function to extract public_id from cloudinary URL
export const extractPublicId = (url: string): string => {
  // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
  const parts = url.split("/");
  const filename = parts[parts.length - 1];
  const publicId = filename?.split(".")[0];
  return publicId || "";
};

export default cloudinary;
