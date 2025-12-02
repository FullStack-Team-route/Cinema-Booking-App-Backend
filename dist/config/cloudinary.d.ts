import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
export declare const storage: CloudinaryStorage;
export declare const deleteFromCloudinary: (publicId: string) => Promise<void>;
export declare const extractPublicId: (url: string) => string;
export default cloudinary;
//# sourceMappingURL=cloudinary.d.ts.map