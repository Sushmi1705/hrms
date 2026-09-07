import axios from 'axios';

export interface DepartmentDto {
  id: string;
  code: string;
  name: string;
}

const API_URL = 'http://localhost:5002/api/v1/Department';

export const getDepartments = async (): Promise<DepartmentDto[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createDepartment = async (data: Omit<DepartmentDto, 'id'>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const deleteDepartment = async (id: string) => {
  const response = await axios.delete(API_URL + "/" + id);
  return response.data;
};

