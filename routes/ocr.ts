import express, { Request, Response } from "express";
import Tesseract from "tesseract.js";
import sharp from "sharp";
import fileUpload, { UploadedFile } from "express-fileupload";

const router = express.Router();

router.post("/extract", async (req: Request, res: Response) => {
  try {
    console.log(req.files);
    if (!req.files?.Image) {
      res.status(400).json({ message: "No image uploaded" });
      return;
    }

    const file = req.files.Image as UploadedFile;
    const processedImage = await sharp(file.data).toBuffer();
    const {
      data: { text },
    } = await Tesseract.recognize(processedImage, "eng");
    const cleanedText = text
      .replace(/\n/g, " ") // Replace line breaks with spaces
      .replace(/-\s+/g, "") // Remove hyphens at the end of lines
      .replace(/\s{2,}/g, " "); // Remove extra spaces
    const wordsArray = cleanedText.split(",").map((word) => {
      return word
        .replace(/[^a-zA-Z0-9\s,().:-]/g, "") // Remove special characters except essential punctuation
        .replace(/\s{2,}/g, " ") // Remove extra spaces
        .replace(/\s*-\s*/g, "") // Remove hyphens and merge words
        .trim();
    });
    res.json({ wordsArray });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "OCR processing failed" });
  }
});

export default router;
