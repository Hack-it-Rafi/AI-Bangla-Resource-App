import QueryBuilder from '../../builder/QueryBuilder';
import { TSpeech } from './Speech.interface';
import { Speech } from './Speech.model';

const createSpeechIntoDB = async (payload: TSpeech) => {
  const result = await Speech.create(payload);
  return result;
};

const getAllSpeechesFromDB = async (query: Record<string, unknown>) => {
  const speechQuery = new QueryBuilder(Speech.find(), query)
    // .search(se)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await speechQuery.modelQuery;
  return result;
};

const getSingleSpeechFromDB = async (id: string) => {
  const result = await Speech.findById(id);
  return result;
};


export const SpeechServices = {
  createSpeechIntoDB,
  getAllSpeechesFromDB,
  getSingleSpeechFromDB,
};
