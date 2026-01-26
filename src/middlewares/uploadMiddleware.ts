import multer from "multer";
import { storage } from "../config/cloudinaryConfig.js";

/**
 * Filter to allow only images
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPEG, PNG and WEBP are allowed."),
      false,
    );
  }
};

/**
 * Export the upload middleware
 */
export const uploadProfileImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
