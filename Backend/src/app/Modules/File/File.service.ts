import QueryBuilder from '../../builder/QueryBuilder';
import { TFile } from './File.interface';
import { File } from './File.model';

const createFileIntoDB = async (payload: TFile) => {
  const result = await File.create(payload);
  return result;
};

const getAllFilesFromDB = async (query: Record<string, unknown>) => {
  const fileQuery = new QueryBuilder(File.find(), query)
    // .search(se)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await fileQuery.modelQuery;
  return result;
};

const getSingleFileFromDB = async (id: string) => {
  const result = await File.findById(id);
  return result;
};


export const FileServices = {
  createFileIntoDB,
  getAllFilesFromDB,
  getSingleFileFromDB,
};
