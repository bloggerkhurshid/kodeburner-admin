import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.kodeburner.com').replace(/\/+$/, '');

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 60000,
});

// Add token to request headers and disable timeout for file uploads
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Disable client timeout for FormData (file uploads) so large PDFs don't abort
    if (config.data instanceof FormData) {
      if (!config.timeout || config.timeout === 60000 || config.timeout === 20000) {
        config.timeout = 0;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and user on 401 Unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error.response?.data || { message: error.message || 'Network or server error' });
  }
);

export default api;
