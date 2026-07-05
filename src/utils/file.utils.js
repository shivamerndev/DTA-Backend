import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Saves a base64 encoded image string to the uploads directory.
 * @param {string} base64Str - The base64 image data URL.
 * @param {string} subDir - Subdirectory inside uploads.
 * @returns {string} The relative URL of the saved file.
 */
export const saveBase64Image = (base64Str, subDir = "attendance") => {
  const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  let imageBuffer;
  let extension = "jpg";

  if (!matches || matches.length !== 3) {
    // Check if it's already raw base64 without data URI header
    try {
      imageBuffer = Buffer.from(base64Str, "base64");
    } catch (e) {
      throw new Error("Invalid base64 image format");
    }
  } else {
    extension = matches[1].split("/")[1] || "jpg";
    // Handle jpeg vs jpg extension
    if (extension === "jpeg") extension = "jpg";
    imageBuffer = Buffer.from(matches[2], "base64");
  }

  // Target directory in backend/src/uploads
  const uploadDir = path.resolve(__dirname, "..", "uploads", subDir);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${extension}`;
  const filePath = path.join(uploadDir, filename);
  fs.writeFileSync(filePath, imageBuffer);

  return `/uploads/${subDir}/${filename}`;
};

/**
 * Calculates the distance between two coordinates in meters using the Haversine formula.
 */
export const getHaversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
};
