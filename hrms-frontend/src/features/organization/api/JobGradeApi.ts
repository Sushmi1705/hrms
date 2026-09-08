import axios from 'axios';
import { API_BASE_URL } from '@/lib/api';

export interface JobGradeDto {
  id: string;
  code: string;
  name: string;
}

const API_URL = `${API_BASE_URL}/api/v1/JobGrade`;

export const getJobGrades = async (): Promise<JobGradeDto[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createJobGrade = async (data: Omit<JobGradeDto, 'id'>) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const deleteJobGrade = async (id: string) => {
  const response = await axios.delete(API_URL + "/" + id);
  return response.data;
};

