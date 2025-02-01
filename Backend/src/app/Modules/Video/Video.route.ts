import express from 'express';
import multer from 'multer';
import path from 'path';
import { VideoControllers } from './Video.controller';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
    cb(null, 'Videos/');
    },
    filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post(
    '/add-file',
    upload.single('file'),
    VideoControllers.createVideo
);

router.get('/', 
    VideoControllers.getAllVideos);

router.get('/:id', 
    VideoControllers.getSingleVideo);

router.get('/file/:id', 
    VideoControllers.getVideoFile);

export const VideoRoutes = router;
