import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
// import path from 'path';
import { PdfServices } from './Pdf.service';

const createPdf = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};
  const PdfData = { ...req.body, ...fileData };
  const result = await PdfServices.createPdfIntoDB(PdfData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pdf is created successfully',
    data: result,
  });
});

const getAllPdfs: RequestHandler = catchAsync(async (req, res) => {
  const result = await PdfServices.getAllPdfsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Pdfs are retrieved successfully',
    data: result,
  });
});

const getSinglePdf = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await PdfServices.getSinglePdfFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
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
  getPdfFile
};
