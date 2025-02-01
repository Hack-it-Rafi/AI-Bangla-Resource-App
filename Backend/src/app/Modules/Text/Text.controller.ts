import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { TextServices } from './Text.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const getTranslation = async (content: string) => {
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const enhancedPrompt = `
        The following text is written in whatever language. Convert it to Bangla and provide your response strictly in Bangla:
         "${content}"
        `;

  const result = await model.generateContent(enhancedPrompt);

  return result;
};

const createText = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};

  let fileContent = '';
  if (req.file) {
    const filePath = path.join(req.file.destination, req.file.filename);
    fileContent = fs.readFileSync(filePath, 'utf-8');
  }

  const translatedContent = await getTranslation(fileContent);

  const TextData = { ...req.body, ...fileData };
  const result = await TextServices.createTextIntoDB(TextData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Text is created successfully',
    data: {
      ...result,
      translatedContent,
    },
  });
});

const getAllTexts: RequestHandler = catchAsync(async (req, res) => {
  const result = await TextServices.getAllTextsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Texts are retrieved successfully',
    data: result,
  });
});

const getSingleText = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await TextServices.getSingleTextFromDB(id);

  sendResponse(res, {
    statusCode: 200,
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
  getTextFile,
};
