import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh/', { refresh: refreshToken }),
  getProfile: () => api.get('/auth/profile/'),
};

export const vehicleAPI = {
  getAll: () => api.get('/vehicles/'),
  getById: (id) => api.get(`/vehicles/${id}/`),
  create: (data) => api.post('/vehicles/', data),
  update: (id, data) => api.put(`/vehicles/${id}/`, data),
  delete: (id) => api.delete(`/vehicles/${id}/`),
};

export const trackingAPI = {
  getCurrentPositions: () => api.get('/tracking/positions/current/'),
  getPositions: (vehicleId) => api.get(`/tracking/positions/?vehicle=${vehicleId}`),
  getTrips: (vehicleId) => api.get(`/tracking/trips/?vehicle=${vehicleId}`),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/'),
};

export default api;