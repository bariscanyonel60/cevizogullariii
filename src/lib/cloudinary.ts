import { v2 as cloudinary } from "cloudinary";

let configured = false;

export function configureCloudinary() {
  if (configured) return;

  if (process.env.CLOUDINARY_URL) {
    cloudinary.config({ secure: true });
  } else {
    const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
    const api_key = process.env.CLOUDINARY_API_KEY;
    const api_secret = process.env.CLOUDINARY_API_SECRET;
    if (!cloud_name || !api_key || !api_secret) {
      throw new Error("Cloudinary env eksik (CLOUDINARY_*)");
    }
    cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  }

  configured = true;
}

export function cloudinaryFolder(collection: "gallery" | "yapi-insaat") {
  return `cevizogullari/${collection}`;
}

export { cloudinary };
