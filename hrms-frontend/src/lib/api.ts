import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:5002/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});
