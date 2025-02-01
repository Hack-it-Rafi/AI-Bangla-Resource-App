import express from 'express';
import multer from 'multer';
import path from 'path';
import { FileControllers } from './File.controller';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'Files/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage });

router.post(
    '/add-file',
    // auth('admin'),
    upload.single('file'),
    // validateRequest(FileValidation.addFileSchema),
    FileControllers.createFile
);

router.get('/', 
    // auth(), 
    FileControllers.getAllFiles);

router.get('/:id', 
    // auth(), 
    FileControllers.getSingleFile);

router.get('/file/:id', 
    // auth(), 
    FileControllers.getFileFile);

export const FileRoutes = router;
