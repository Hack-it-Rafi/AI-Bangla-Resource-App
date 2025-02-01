import express from 'express';
import multer from 'multer';
import path from 'path';
import { TextControllers } from './Text.controller';


const router = express.Router();

const textsDirectory = path.join(process.cwd(), 'Texts/');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, textsDirectory);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post(
    '/add-file',
    upload.single('file'),
    TextControllers.createText
);

router.get('/', 
    TextControllers.getAllTexts);

router.get('/:id', 
    TextControllers.getSingleText);

router.get('/file/:id', 
    TextControllers.getTextFile);

export const TextRoutes = router;