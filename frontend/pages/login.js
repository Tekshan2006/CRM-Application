// ========================================
// LOGIN PAGE - FULLY COMMENTED FOR STUDENTS
// ========================================
// This is the login page where users enter email and password
// They get redirected here if they're not logged in

// ===== IMPORTS =====
import { useState } from 'react';           // For managing form state
import { useRouter } from 'next/router';    // For navigation after login
import useAuthStore from '@/lib/store';     // For saving auth info globally
import { authAPI } from '@/lib/api';        // For calling login API
import Link from 'next/link';               // For navigation link

// =========================================
// LOGIN COMPONENT
// =========================================
export default function Login() {
  // ===== STATE VARIABLES =====
  // These store form input values
  const [email, setEmail] = useState('admin@example.com');  // Pre-filled for demo
  const [password, setPassword] = useState('password123');   // Pre-filled for demo
  const [error, setError] = useState('');                    // Error message if login fails
  const [loading, setLoading] = useState(false);             // Show loading state during login

  // ===== HOOKS =====
  const router = useRouter();        // For redirecting after successful login
  const { setAuth } = useAuthStore(); // For saving user info globally

  // ===== HANDLE FORM SUBMIT =====
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent page reload
    setError('');        // Clear previous errors
    setLoading(true);    // Show loading state

    try {
      // STEP 1: Call login API with email and password
      const response = await authAPI.login(email, password);
      
      // STEP 2: Save user info and token to store and localStorage
      setAuth(response.data.user, response.data.token);
      
      // STEP 3: Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      // If login fails, show error message
      setError(err.response?.data?.error || 'Login failed');
      
    } finally {
      // Always turn off loading state when done
      setLoading(false);
    }
  };

  // ===== RENDER =====
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        {/* TITLE */}
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">CRM System</h1>
        <p className="text-center text-gray-600 mb-8">Lead Management System</p>

        {/* ERROR MESSAGE (shown if login fails) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Update state when user types
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* PASSWORD INPUT */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // Update state when user types
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}  // Disable during login attempt
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* DEMO CREDENTIALS INFO */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Demo Credentials:</p>
          <p>Email: admin@example.com</p>
          <p>Password: password123</p>
        </div>

        {/* REGISTER LINK */}
        <div className="mt-6 text-center text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
