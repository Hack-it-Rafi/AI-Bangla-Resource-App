import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { RequestHandler } from 'express';
import fs from 'fs';
import { VideoServices } from './Video.service';

const createVideo = catchAsync(async (req, res) => {
  const fileData = req.file ? { fileUrl: req.file.path } : {};
  const VideoData = { ...req.body, ...fileData };
  const result = await VideoServices.createVideoIntoDB(VideoData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Video is created successfully',
    data: result,
  });
});

const getAllVideos: RequestHandler = catchAsync(async (req, res) => {
  const result = await VideoServices.getAllVideosFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Videos are retrieved successfully',
    data: result,
  });
});

const getSingleVideo = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await VideoServices.getSingleVideoFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Video is retrieved successfully',
    data: result,
  });
});

const getVideoFile = catchAsync(async (req, res) => {
  const { id } = req.params;
  const video = await VideoServices.getSingleVideoFromDB(id);

  if (!video || !video.fileUrl) {
    return res.status(404).send('Video not found');
  }

  res.contentType('application/mp4');
  fs.createReadStream(video.fileUrl).pipe(res);
});

export const VideoControllers = {
  createVideo,
  getAllVideos,
  getSingleVideo,
  getVideoFile,
};
