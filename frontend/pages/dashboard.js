import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import DashboardStats from '@/components/DashboardStats';
import { leadsAPI } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await leadsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome to your CRM system</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading dashboard...</div>
            </div>
          ) : (
            <DashboardStats stats={stats} />
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
