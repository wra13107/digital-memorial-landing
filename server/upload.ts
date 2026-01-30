import { Router } from "express";
import { storagePut } from "./storage";

export const uploadRouter = Router();

// Middleware to parse multipart form data
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const s3Key = req.body.s3Key;
    if (!s3Key) {
      return res.status(400).json({ error: "S3 key not provided" });
    }

    // Upload to S3
    const result = await storagePut(s3Key, req.file.buffer, req.file.mimetype);

    res.json({
      success: true,
      url: result.url,
      key: result.key,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});
