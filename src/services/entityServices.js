import api from './api';

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

export const noteService = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (formData, onProgress) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    }
  }),
  update: (id, formData, onProgress) => api.post(`/notes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    }
  }),
  delete: (id) => api.delete(`/notes/${id}`),
};

export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (formData, onProgress) => api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    }
  }),
  update: (id, formData, onProgress) => api.post(`/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        const percent = Math.round((e.loaded * 100) / e.total);
        onProgress(percent);
      }
    }
  }),
  delete: (id) => api.delete(`/books/${id}`),
};

export const semesterService = {
  getAll: () => api.get('/semesters'),
  getById: (id) => api.get(`/semesters/${id}`),
  create: (formData) => api.post('/semesters', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  }),
  update: (id, formData) => api.post(`/semesters/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  }),
  delete: (id) => api.delete(`/semesters/${id}`),
};

export const adminService = {
  getAll: (params) => api.get('/admins', { params }),
  getById: (id) => api.get(`/admins/${id}`),
  create: (formData) => api.post('/admins', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  }),
  update: (id, formData) => api.post(`/admins/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  }),
  resendInvitation: (id) => api.post(`/admins/${id}/resend-invitation`),
  activate: (id) => api.post(`/admins/${id}/activate`),
  deactivate: (id) => api.post(`/admins/${id}/deactivate`),
  delete: (id) => api.delete(`/admins/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};

export const appLinkService = {
  getAll: (params) => api.get('/app-links', { params }),
  getAdminAll: (params) => api.get('/admin/app-links', { params }),
  getById: (id) => api.get(`/admin/app-links/${id}`),
  create: (formData) => api.post('/admin/app-links', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  }),
  update: (id, formData) => api.post(`/admin/app-links/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 0,
  }),
  delete: (id) => api.delete(`/admin/app-links/${id}`),
};

export const settingsService = {
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (data) => api.post('/admin/settings', data),
  sendNotification: (data) => api.post('/admin/send-notification', data),
};

