import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import { PdfServices } from './Pdf.service';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../../config';

const getTranslation = async (content: string) => {
  const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY as string);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const enhancedPrompt = `
          The following text is written in whatever language. Convert it to Bangla and include the indentations. Must provide your response strictly in Bangla:
           "${content}"
          `;

  const result = await model.generateContent(enhancedPrompt);

  return result;
};

const createPdf = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};

  let fileContent = '';
  if (req.file) {
    const filePath = path.join(req.file.destination, req.file.filename);
    const pdfBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(pdfBuffer);
    fileContent = pdfData.text;
  }

  const translatedContent = await getTranslation(fileContent);

  const PdfData = { ...req.body, ...fileData };
  const result = await PdfServices.createPdfIntoDB(PdfData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pdf is created successfully',
    data: {
      ...result,
      translatedContent,
    },
  });
});

const getAllPdfs: RequestHandler = catchAsync(async (req, res) => {
  const result = await PdfServices.getAllPdfsFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pdfs are retrieved successfully',
    data: result,
  });
});

const getSinglePdf = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PdfServices.getSinglePdfFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Pdf is retrieved successfully',
    data: result,
  });
});

const getPdfFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const pdf = await PdfServices.getSinglePdfFromDB(id);

  if (!pdf || !pdf.fileUrl) {
    return res.status(404).send('Pdf not found');
  }

  res.contentType('application/pdf');
  fs.createReadStream(pdf.fileUrl).pipe(res);
});

export const PdfControllers = {
  createPdf,
  getAllPdfs,
  getSinglePdf,
  getPdfFile,
};
