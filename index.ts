import express from 'express';
import fileUpload from 'express-fileupload';
import ocrRoute from './routes/ocr';

const app = express();

const PORT = 3000;

app.use(fileUpload());
app.use(express.json());
app.use('/api/ocr', ocrRoute);

app.listen(PORT, () => {
  console.log(`[ocr-server]: listening on port: ${PORT} `);
});
