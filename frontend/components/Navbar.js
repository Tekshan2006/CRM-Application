import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useAuthStore from '@/lib/store';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold">
              CRM System
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link href="/dashboard" className={`hover:text-blue-200 ${router.pathname === '/dashboard' ? 'text-blue-200' : ''}`}>
                Dashboard
              </Link>
              <Link href="/leads" className={`hover:text-blue-200 ${router.pathname === '/leads' ? 'text-blue-200' : ''}`}>
                Leads
              </Link>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <span className="text-sm">{user?.name || 'User'}</span>
            <button onClick={handleLogout} className="flex items-center space-x-2 hover:text-blue-200">
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/dashboard" className="block hover:text-blue-200 py-2">
              Dashboard
            </Link>
            <Link href="/leads" className="block hover:text-blue-200 py-2">
              Leads
            </Link>
            <button onClick={handleLogout} className="w-full text-left hover:text-blue-200 py-2">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
