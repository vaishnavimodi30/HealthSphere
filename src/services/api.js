// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  healthCheck: () => api.get('/auth/health'),
};

// User API
export const userAPI = {
  getUsers: () => api.get('/users'),
  getDoctors: () => api.get('/users/doctors'),
  getPatients: () => api.get('/users/patients'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUserProfile: (id, data) => api.put(`/users/${id}/profile`, data),
  checkEmail: (email) => api.get(`/users/check-email?email=${email}`),
  getUserStats: () => api.get('/users/stats'),
};

// Patient API
export const patientAPI = {
  getAll: () => api.get('/patients'),
  getById: (id) => api.get(`/patients/${id}`),
  updateProfile: (id, data) => api.put(`/patients/${id}/profile`, data),
  search: (name) => api.get(`/patients/search?name=${name}`),
  getByBloodType: (bloodType) => api.get(`/patients/blood-type/${bloodType}`),
};

// Doctor API
// Doctor API
export const doctorAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/doctors');
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      throw error;
    }
  },
  getBySpecialization: (specialization) => api.get(`/doctors/specialization/${specialization}`),
  updateProfile: (id, data) => api.put(`/doctors/${id}/profile`, data),
};
// Appointment API
export const appointmentAPI = {
  schedule: (data) => api.post('/appointments', data),
  getPatientAppointments: (patientId) => api.get(`/appointments/patient/${patientId}`),
  getDoctorAppointments: (doctorId) => api.get(`/appointments/doctor/${doctorId}`),
  getAvailableSlots: (doctorId, date) => api.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`),
  updateStatus: (appointmentId, status) => api.put(`/appointments/${appointmentId}/status`, { status }),
};

// Medical Records API
export const medicalRecordsAPI = {
  create: (data) => api.post('/medical-records', data),
  getPatientRecords: (patientId) => api.get(`/medical-records/patient/${patientId}`),
  update: (recordId, data) => api.put(`/medical-records/${recordId}`, data),
};

export default api;