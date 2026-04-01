import axios from 'axios';
import { getToken } from '../utils/token';

const envBaseUrl = import.meta.env.VITE_API_URL?.trim();
const baseURL = import.meta.env.DEV ? '/api' : envBaseUrl || '/api';

export const http = axios.create({ baseURL });

http.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
