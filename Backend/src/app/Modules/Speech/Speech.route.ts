    import express from 'express';
    import multer from 'multer';
    import path from 'path';
    import { SpeechControllers } from './Speech.controller';

    const router = express.Router();

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
        cb(null, 'Speeches/');
        },
        filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
        }
    });
    
    const upload = multer({ storage });

    router.post(
        '/add-file',
        upload.single('file'),
        SpeechControllers.createSpeech
    );

    router.get('/', 
        SpeechControllers.getAllSpeeches);

    router.get('/:id', 
        SpeechControllers.getSingleSpeech);

    router.get('/file/:id', 
        SpeechControllers.getSpeechFile);

    export const SpeechRoutes = router;
