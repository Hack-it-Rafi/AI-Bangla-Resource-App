import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { SpeechServices } from './Speech.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager, FileState } from '@google/generative-ai/server';
import config from '../../config';

const createSpeech = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};

  if (req.file) {
    const SpeechData = { ...req.body, ...fileData };
    const result = await SpeechServices.createSpeechIntoDB(SpeechData);

    const filePath = path.join(req.file.destination, req.file.filename);
    const fileManager = new GoogleAIFileManager(
      config.GEMINI_API_KEY as string,
    );

    // Upload the audio file to Google AI
    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: req.file.mimetype,
      displayName: req.file.originalname,
    });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write('.');
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error('Audio processing failed.');
    }

    const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const speechToTextResult = await model.generateContent([
      'Translate the audio clip. Must provide your response strictly in Bangla',
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Speech is created and transcribed successfully',
      data: {
        ...result,
        translatedContent: speechToTextResult.response.text(),
      },
    });
  }
});

// const createSpeech = catchAsync(async (req, res) => {
//   const fileData = req.file ? { fileUrl: req.file.path } : {};
//   console.log(req.file);

//   const SpeechData = { ...req.body, ...fileData };
//   const result = await SpeechServices.createSpeechIntoDB(SpeechData);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: 'Speech is created successfully',
//     data: result,
//   });
// });

const getAllSpeeches: RequestHandler = catchAsync(async (req, res) => {
  const result = await SpeechServices.getAllSpeechesFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Speeches are retrieved successfully',
    data: result,
  });
});

const getSingleSpeech = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SpeechServices.getSingleSpeechFromDB(id);

  sendResponse(res, {
    statusCode: 200,
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

  res.contentType('application/mp3');
  fs.createReadStream(speech.fileUrl).pipe(res);
});

export const SpeechControllers = {
  createSpeech,
  getAllSpeeches,
  getSingleSpeech,
  getSpeechFile,
};
