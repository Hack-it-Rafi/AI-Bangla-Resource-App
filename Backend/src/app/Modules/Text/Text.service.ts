import QueryBuilder from '../../builder/QueryBuilder';
import { TText } from './Text.interface';
import { Text } from './Text.model';

const createTextIntoDB = async (payload: TText) => {
  const result = await Text.create(payload);
  return result;
};

const getAllTextsFromDB = async (query: Record<string, unknown>) => {
  const TextQuery = new QueryBuilder(Text.find(), query)
    // .search(se)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await TextQuery.modelQuery;
  return result;
};

const getSingleTextFromDB = async (id: string) => {
  const result = await Text.findById(id);
  return result;
};


export const TextServices = {
  createTextIntoDB,
  getAllTextsFromDB,
  getSingleTextFromDB,
};
