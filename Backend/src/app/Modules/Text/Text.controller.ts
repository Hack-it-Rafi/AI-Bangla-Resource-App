import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
// import path from 'path';
import { TextServices } from './Text.service';

const createText = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};
  const TextData = { ...req.body, ...fileData };
  const result = await TextServices.createTextIntoDB(TextData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Text is created successfully',
    data: result,
  });
});

const getAllTexts: RequestHandler = catchAsync(async (req, res) => {
  const result = await TextServices.getAllTextsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Texts are retrieved successfully',
    data: result,
  });
});

const getSingleText = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TextServices.getSingleTextFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Text is retrieved successfully',
    data: result,
  });
});

const getTextFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const text = await TextServices.getSingleTextFromDB(id);

  if (!text || !text.fileUrl) {
    return res.status(404).send('Text not found');
  }

  res.contentType('application/txt');
  fs.createReadStream(text.fileUrl).pipe(res);
});

export const TextControllers = {
  createText,
  getAllTexts,
  getSingleText,
  getTextFile
};
