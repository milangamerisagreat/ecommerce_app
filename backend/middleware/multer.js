import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "profilepics",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({
  storage: profileStorage,
});

export const multipleUpload = multer({
  storage: productStorage,
}).array("files", 5);

export default upload;