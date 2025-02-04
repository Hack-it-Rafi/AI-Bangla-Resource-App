import express from 'express';
import multer from 'multer';
import path from 'path';
import { PdfControllers } from './Pdf.controller';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'Pdfs/');
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post(
    '/add-file',
    upload.single('file'),
    PdfControllers.createPdf
);

router.get('/', 
    PdfControllers.getAllPdfs);

router.get('/:id', 
    PdfControllers.getSinglePdf);

router.get('/file/:id', 
    PdfControllers.getPdfFile);

export const PdfRoutes = router;
