// ========================================
// API CLIENT - FULLY COMMENTED FOR STUDENTS
// ========================================
// This file creates an Axios HTTP client for talking to the backend
// Axios = library for making HTTP requests easier than fetch

// Import Axios library
import axios from 'axios';

// =========================================
// SET UP API URL
// =========================================
// Get API URL from environment variables or use default
// process.env.NEXT_PUBLIC_API_URL is set in .env.local
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// =========================================
// CREATE AXIOS INSTANCE
// =========================================
// Create an Axios instance with default settings
export const api = axios.create({
  baseURL: API_URL,  // All requests go to this URL
  headers: {
    'Content-Type': 'application/json',  // Send/receive JSON
  },
});

// =========================================
// INTERCEPTOR: Add Token to Every Request
// =========================================
// Interceptors are functions that run before/after each request
// This interceptor adds the JWT token to Authorization header
api.interceptors.request.use((config) => {
  // Only try to get token from localStorage in browser (not server)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // If token exists, add it to the request header
  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
    // Format: Authorization: Bearer eyJhbGc...
  }
  
  return config;  // Continue with the request
});

// =========================================
// AUTH API - Login and Register
// =========================================
// These functions call the /auth backend endpoints
export const authAPI = {
  // Login: send email and password, get token back
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Register: send name, email, password to create new account
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
};

// =========================================
// LEADS API - CRUD Operations
// =========================================
// These functions call the /leads backend endpoints
export const leadsAPI = {
  // Get all leads (with optional filters like status, search, etc)
  getAll: (filters = {}) => api.get('/leads', { params: filters }),
  
  // Get single lead by ID
  getById: (id) => api.get('/leads/' + id),
  
  // Create new lead
  create: (data) => api.post('/leads', data),
  
  // Update existing lead
  update: (id, data) => api.put('/leads/' + id, data),
  
  // Delete lead
  delete: (id) => api.delete('/leads/' + id),
  
  // Get dashboard statistics
  getStats: () => api.get('/leads/dashboard/stats'),
};

// =========================================
// NOTES API - Add, Read, Delete Notes
// =========================================
// These functions call the /notes backend endpoints
export const notesAPI = {
  // Add new note to a lead
  add: (leadId, content) => api.post('/notes', { leadId, content }),
  
  // Get all notes for a specific lead
  getByLeadId: (leadId) => api.get('/notes/lead/' + leadId),
  
  // Delete a note
  delete: (id) => api.delete('/notes/' + id),
};
