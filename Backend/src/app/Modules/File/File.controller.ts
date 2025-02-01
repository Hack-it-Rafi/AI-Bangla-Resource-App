import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
// import path from 'path';
import { FileServices } from './File.service';
import mime from 'mime';

const createFile = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};
  const FileData = { ...req.body, ...fileData };
  const result = await FileServices.createFileIntoDB(FileData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File is created successfully',
    data: result,
  });
});

const getAllFiles: RequestHandler = catchAsync(async (req, res) => {
  const result = await FileServices.getAllFilesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Files are retrieved successfully',
    data: result,
  });
});

const getSingleFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await FileServices.getSingleFileFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'File is retrieved successfully',
    data: result,
  });
});

const getFileFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const file = await FileServices.getSingleFileFromDB(id);

  if (!file || !file.fileUrl) {
    return res.status(404).send('File not found');
  }

  //   res.contentType('file/*');
  const contentType = mime.getType(file.fileUrl);

  if (!contentType) {
    return res.status(500).send('Could not determine file type');
  }

  res.contentType(contentType);
  fs.createReadStream(file.fileUrl).pipe(res);
});

export const FileControllers = {
  createFile,
  getAllFiles,
  getSingleFile,
  //   updateFile,
  getFileFile,
};
