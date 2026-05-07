import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import LeadsTable from '@/components/LeadsTable';
import { leadsAPI } from '@/lib/api';

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [leadSource, setLeadSource] = useState('');
  const [search, setSearch] = useState('');
  
  // 1. NEW: Added state for assigned salesperson
  const [assignedSalesperson, setAssignedSalesperson] = useState('');

  useEffect(() => {
    loadLeads();
  // 2. NEW: Added assignedSalesperson to dependency array
  }, [status, leadSource, search, assignedSalesperson]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (status) filters.status = status;
      if (leadSource) filters.leadSource = leadSource;
      if (search) filters.search = search;
      
      // 3. NEW: Added filter logic for assignedSalesperson
      if (assignedSalesperson) filters.assignedSalesperson = assignedSalesperson;

      const response = await leadsAPI.getAll(filters);
      setLeads(response.data);
    } catch (error) {
      console.error('Failed to load leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      try {
        await leadsAPI.delete(id);
        setLeads(leads.filter((lead) => lead.id !== id));
      } catch (error) {
        console.error('Failed to delete lead:', error);
        alert('Failed to delete lead');
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Leads</h1>
              <p className="text-gray-600 mt-2">Manage your sales leads</p>
            </div>
            <Link href="/leads/new" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
              + New Lead
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            
            {/* 4. NEW: Changed grid-cols-4 to grid-cols-5 to accommodate the new filter */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search by name, company, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lead Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Email">Cold Email</option>
                  <option value="Event">Event</option>
                </select>
              </div>

              {/* NEW: Added Assigned Salesperson Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Salesperson ID</label>
                <input
                  type="number"
                  placeholder="Enter ID..."
                  value={assignedSalesperson}
                  onChange={(e) => setAssignedSalesperson(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">&nbsp;</label>
                <button
                  onClick={() => {
                    setStatus('');
                    setLeadSource('');
                    setSearch('');
                    setAssignedSalesperson(''); // NEW: Clear this state too
                  }}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Leads Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">Loading leads...</div>
              </div>
            ) : leads.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-gray-600">No leads found</div>
              </div>
            ) : (
              <LeadsTable leads={leads} onDelete={handleDelete} />
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}