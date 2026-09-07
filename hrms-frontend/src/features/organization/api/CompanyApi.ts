import { apiClient } from '@/lib/api';

export interface CompanyDto {
  id: string;
  code: string;
  name: string;
}

export const getCompanys = async (): Promise<CompanyDto[]> => {
  const { data } = await apiClient.get('/Company');
  return data;
};

export const deleteCompany = async (id: string): Promise<void> => {
  await apiClient.delete('/Company/' + id);
};
