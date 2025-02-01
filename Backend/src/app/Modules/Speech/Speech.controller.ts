import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
// import path from 'path';
import mime from 'mime';
import { SpeechServices } from './Speech.service';

const createSpeech = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};
  const SpeechData = { ...req.body, ...fileData };
  const result = await SpeechServices.createSpeechIntoDB(SpeechData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Speech is created successfully',
    data: result,
  });
});

const getAllSpeeches: RequestHandler = catchAsync(async (req, res) => {
  const result = await SpeechServices.getAllSpeechesFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Speeches are retrieved successfully',
    data: result,
  });
});

const getSingleSpeech = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpeechServices.getSingleSpeechFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Speech is retrieved successfully',
    data: result,
  });
});

const getSpeechFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const speech = await SpeechServices.getSingleSpeechFromDB(id);

  if (!speech || !speech.fileUrl) {
    return res.status(404).send('speech not found');
  }

  //   res.contentType('file/*');
  const contentType = mime.getType(speech.fileUrl);

  if (!contentType) {
    return res.status(500).send('Could not determine file type');
  }

  res.contentType(contentType);
  fs.createReadStream(speech.fileUrl).pipe(res);
});

export const SpeechControllers = {
  createSpeech,
  getAllSpeeches,
  getSingleSpeech,
  getSpeechFile
};
