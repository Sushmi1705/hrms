import { apiClient } from '@/lib/api';

export interface LocationDto {
  id: string;
  code: string;
  name: string;
}

export const getLocations = async (): Promise<LocationDto[]> => {
  const { data } = await apiClient.get('/Location');
  return data;
};

export const deleteLocation = async (id: string): Promise<void> => {
  await apiClient.delete('/Location/' + id);
};
