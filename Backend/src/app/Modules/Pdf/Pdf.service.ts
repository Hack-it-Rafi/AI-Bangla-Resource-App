import QueryBuilder from '../../builder/QueryBuilder';
import { TPdf } from './Pdf.interface';
import { Pdf } from './Pdf.model';

const createPdfIntoDB = async (payload: TPdf) => {
  const result = await Pdf.create(payload);
  return result;
};

const getAllPdfsFromDB = async (query: Record<string, unknown>) => {
  const PdfQuery = new QueryBuilder(Pdf.find(), query)
    // .search(se)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await PdfQuery.modelQuery;
  return result;
};

const getSinglePdfFromDB = async (id: string) => {
  const result = await Pdf.findById(id);
  return result;
};


export const PdfServices = {
  createPdfIntoDB,
  getAllPdfsFromDB,
  getSinglePdfFromDB,
};
