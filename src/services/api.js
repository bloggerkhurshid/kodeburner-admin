import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.kodeburner.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Add token to request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for auth and network errors
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
    } else if (!error.response || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED' || (error.response && error.response.status >= 500)) {
      // Trigger global Network Issue popup
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('app-network-error', {
          detail: {
            title: 'Network Issue',
            message: 'Unable to communicate with the server. Please check your internet connection and try again.'
          }
        }));
      }
    }
    return Promise.reject(error.response?.data || { message: 'Network or server error' });
  }
);

export default api;
