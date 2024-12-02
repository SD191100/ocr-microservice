"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const sharp_1 = __importDefault(require("sharp"));
const router = express_1.default.Router();
router.post("/extract", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.files);
        if (!((_a = req.files) === null || _a === void 0 ? void 0 : _a.Image)) {
            res.status(400).json({ message: "No image uploaded" });
            return;
        }
        const file = req.files.Image;
        const processedImage = yield (0, sharp_1.default)(file.data).toBuffer();
        const { data: { text }, } = yield tesseract_js_1.default.recognize(processedImage, "eng");
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
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ error: "OCR processing failed" });
    }
}));
exports.default = router;
