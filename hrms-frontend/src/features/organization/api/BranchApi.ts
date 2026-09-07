import { apiClient } from '@/lib/api';

export interface BranchDto {
  id: string;
  code: string;
  name: string;
}

export const getBranchs = async (): Promise<BranchDto[]> => {
  const { data } = await apiClient.get('/Branch');
  return data;
};

export const deleteBranch = async (id: string): Promise<void> => {
  await apiClient.delete('/Branch/' + id);
};
