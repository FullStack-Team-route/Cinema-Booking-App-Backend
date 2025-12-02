import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
// Configuration
if (!process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET) {
    throw new Error("Cloudinary environment variables are not set.");
}
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Cloudinary storage for multer
export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "cinema-booking/movies", // Folder in cloudinary
            format: file.mimetype.split("/")[1], // Extract format from mimetype
            public_id: `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}`,
            transformation: [
                { width: 1000, height: 1000, crop: "limit" }, // Max dimensions
                { quality: "auto" }, // Auto quality
            ],
        };
    },
});
// Function to delete image from cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    }
    catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error;
    }
};
// Function to extract public_id from cloudinary URL
export const extractPublicId = (url) => {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const parts = url.split("/");
    const filename = parts[parts.length - 1];
    const publicId = filename?.split(".")[0];
    return publicId || "";
};
export default cloudinary;
//# sourceMappingURL=cloudinary.js.map