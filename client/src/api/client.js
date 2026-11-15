import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('booklog_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(error, fallback = '요청을 처리하지 못했습니다.') {
  return error?.response?.data?.message || error?.message || fallback;
}

export default api;
