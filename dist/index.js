"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const ocr_1 = __importDefault(require("./routes/ocr"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, express_fileupload_1.default)());
app.use(express_1.default.json());
app.use('/api/ocr', ocr_1.default);
app.listen(PORT, () => {
    console.log(`[ocr-server]: listening on port: ${PORT} `);
});
