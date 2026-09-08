import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

export interface EmployeeDto {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  joiningDate: string;
}

const API_URL = `${API_BASE_URL}/api/v1/Employees`;

export const getEmployees = async (): Promise<EmployeeDto[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const deleteEmployee = async (id: string) => {
  const response = await axios.delete(API_URL + "/" + id);
  return response.data;
};
