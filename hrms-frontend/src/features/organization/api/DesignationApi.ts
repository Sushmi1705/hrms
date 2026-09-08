import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

export interface DesignationDto {
  id: string;
  code: string;
  name: string;
}

const API_URL = `${API_BASE_URL}/api/v1/Designation`;

export const getDesignations = async (): Promise<DesignationDto[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDesignation = async (data: Omit<DesignationDto, 'id'>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const deleteDesignation = async (id: string) => {
  const response = await axios.delete(API_URL + "/" + id);
  return response.data;
};

