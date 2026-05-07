// ========================================
// PROTECTED ROUTE COMPONENT - FULLY COMMENTED
// ========================================
// This component wraps pages that require authentication
// It checks if user is logged in, and redirects to login if not

// ===== IMPORTS =====
import { useRouter } from 'next/router';  // For navigation
import useAuthStore from '@/lib/store';   // For checking auth status
import { useEffect, useState } from 'react'; // React hooks

// =========================================
// PROTECTED ROUTE COMPONENT
// =========================================
// This component checks authentication before rendering
export default function ProtectedRoute({ children }) {
  // ===== HOOKS =====
  const router = useRouter();  // Used to redirect to login page
  const { isAuthenticated, loadAuth } = useAuthStore();  // Check if logged in
  const [isMounted, setIsMounted] = useState(false);  // Track if component mounted

  // ===== EFFECT 1: Load auth on mount =====
  // This runs ONCE when component first loads
  useEffect(() => {
    // Mark component as mounted (fixes SSR hydration issues)
    setIsMounted(true);
    
    // Load stored auth info from localStorage
    loadAuth();
  }, [loadAuth]);  // Dependencies: rerun if loadAuth changes

  // ===== EFFECT 2: Redirect if not authenticated =====
  // This runs when isMounted or isAuthenticated changes
  useEffect(() => {
    // Only check after component is mounted (prevents SSR errors)
    if (isMounted && !isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('token')) {
      // User is not authenticated - redirect to login
      router.push('/login');
    }
  }, [isAuthenticated, isMounted, router]);

  // ===== STEP 1: Return null while component mounting =====
  // This prevents showing page content before auth check completes
  if (!isMounted) {
    return null;  // Don't render anything yet
  }

  // ===== STEP 2: Return null if not authenticated =====
  // Extra safety check - don't show protected content to non-logged-in users
  if (!isAuthenticated && typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return null;  // Don't render anything
  }

  // ===== STEP 3: User is authenticated - render children =====
  // If we reach here, user is logged in - show the protected page
  return children;  // Render the page content
}
