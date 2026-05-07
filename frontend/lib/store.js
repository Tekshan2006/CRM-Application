// ========================================
// ZUSTAND AUTH STORE - FULLY COMMENTED
// ========================================
// This file manages global authentication state using Zustand
// Zustand is a simple state management library (like Redux but easier)
// It stores the logged-in user info and token globally

// Import Zustand's create function
import { create } from 'zustand';

// =========================================
// CREATE AUTHENTICATION STORE
// =========================================
// This store manages who is logged in and their token
const useAuthStore = create((set) => ({
  // ===== STATE VARIABLES =====
  user: null,              // Stores logged-in user object (null if not logged in)
  token: null,             // Stores JWT token (null if not logged in)
  isAuthenticated: false,  // Boolean: are we logged in?

  // ===== ACTION 1: SET AUTH (Save login info) =====
  // This runs when user successfully logs in
  setAuth: (user, token) => {
    // Save token and user to localStorage so they persist after page reload
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));  // JSON.stringify converts object to string
    
    // Update the store state
    set({ user, token, isAuthenticated: true });
  },

  // ===== ACTION 2: LOGOUT (Clear login info) =====
  // This runs when user clicks logout button
  logout: () => {
    // Remove token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear the store state
    set({ user: null, token: null, isAuthenticated: false });
  },

  // ===== ACTION 3: LOAD AUTH (Restore login from localStorage) =====
  // This runs when app first loads to restore session
  loadAuth: () => {
    // typeof window !== 'undefined' checks we're in browser (not server)
    // This prevents errors during server-side rendering (SSR)
    if (typeof window !== 'undefined') {
      // Try to get token and user from localStorage
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      // If both exist, restore the login session
      if (token && user) {
        set({ 
          token, 
          user: JSON.parse(user),  // JSON.parse converts string back to object
          isAuthenticated: true 
        });
      }
    }
  },
}));

// ========== EXPORT ==========
// Other components import this store to access auth state
export default useAuthStore;
