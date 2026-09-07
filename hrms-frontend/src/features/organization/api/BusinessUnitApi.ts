import { apiClient } from '@/lib/api';

export interface BusinessUnitDto {
  id: string;
  code: string;
  name: string;
}

export const getBusinessUnits = async (): Promise<BusinessUnitDto[]> => {
  const { data } = await apiClient.get('/BusinessUnit');
  return data;
};

export const deleteBusinessUnit = async (id: string): Promise<void> => {
  await apiClient.delete('/BusinessUnit/' + id);
};
