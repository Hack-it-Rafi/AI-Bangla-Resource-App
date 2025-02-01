import QueryBuilder from '../../builder/QueryBuilder';
import { TVideo } from './Video.interface';
import { Video } from './Video.model';

const createVideoIntoDB = async (payload: TVideo) => {
  const result = await Video.create(payload);
  return result;
};

const getAllVideosFromDB = async (query: Record<string, unknown>) => {
  const VideoQuery = new QueryBuilder(Video.find(), query)
    // .search(se)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await VideoQuery.modelQuery;
  return result;
};

const getSingleVideoFromDB = async (id: string) => {
  const result = await Video.findById(id);
  return result;
};


export const VideoServices = {
  createVideoIntoDB,
  getAllVideosFromDB,
  getSingleVideoFromDB,
};
