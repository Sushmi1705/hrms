import axios from 'axios';

export interface CostCenterDto {
  id: string;
  code: string;
  name: string;
}

const API_URL = 'http://localhost:5002/api/v1/CostCenter';

export const getCostCenters = async (): Promise<CostCenterDto[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createCostCenter = async (data: Omit<CostCenterDto, 'id'>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const deleteCostCenter = async (id: string) => {
  const response = await axios.delete(API_URL + "/" + id);
  return response.data;
};

