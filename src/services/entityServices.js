import api from './api';

export const userService = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  delete: (id) => api.delete(`/users/${id}`),
};

export const noteService = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (formData) => api.post('/notes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.post(`/notes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/notes/${id}`),
};

export const bookService = {
  getAll: (params) => api.get('/books', { params }),
  getById: (id) => api.get(`/books/${id}`),
  create: (formData) => api.post('/books', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.post(`/books/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/books/${id}`),
};

export const semesterService = {
  getAll: () => api.get('/semesters'),
  getById: (id) => api.get(`/semesters/${id}`),
  create: (formData) => api.post('/semesters', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.post(`/semesters/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/semesters/${id}`),
};

export const adminService = {
  getAll: (params) => api.get('/admins', { params }),
  getById: (id) => api.get(`/admins/${id}`),
  create: (formData) => api.post('/admins', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.post(`/admins/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  resendInvitation: (id) => api.post(`/admins/${id}/resend-invitation`),
  activate: (id) => api.post(`/admins/${id}/activate`),
  deactivate: (id) => api.post(`/admins/${id}/deactivate`),
  delete: (id) => api.delete(`/admins/${id}`),
};

export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};
