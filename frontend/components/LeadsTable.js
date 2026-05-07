import { useState } from 'react';
import { FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import Link from 'next/link';

export default function LeadsTable({ leads, onDelete, onStatusChange }) {
  const [expandedId, setExpandedId] = useState(null);

  const statusColors = {
    New: 'bg-yellow-100 text-yellow-800',
    Contacted: 'bg-blue-100 text-blue-800',
    Qualified: 'bg-purple-100 text-purple-800',
    'Proposal Sent': 'bg-indigo-100 text-indigo-800',
    Won: 'bg-green-100 text-green-800',
    Lost: 'bg-red-100 text-red-800',
  };

  const sourceColors = {
    Website: 'bg-gray-100 text-gray-800',
    LinkedIn: 'bg-blue-100 text-blue-800',
    Referral: 'bg-green-100 text-green-800',
    'Cold Email': 'bg-orange-100 text-orange-800',
    Event: 'bg-pink-100 text-pink-800',
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Source</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Deal Value</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-900 font-medium">{lead.name}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{lead.company_name || '-'}</td>
              <td className="px-6 py-4 text-sm text-gray-700">{lead.email || '-'}</td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${sourceColors[lead.lead_source] || 'bg-gray-100'}`}>
                  {lead.lead_source}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}>
                  {lead.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">${lead.deal_value}</td>
              <td className="px-6 py-4 text-sm flex space-x-2">
                <Link href={`/leads/${lead.id}`} className="p-2 hover:bg-blue-100 rounded transition-colors">
                  <FiEye size={18} className="text-blue-600" />
                </Link>
                <Link href={`/leads/${lead.id}/edit`} className="p-2 hover:bg-green-100 rounded transition-colors">
                  <FiEdit2 size={18} className="text-green-600" />
                </Link>
                <button
                  onClick={() => onDelete(lead.id)}
                  className="p-2 hover:bg-red-100 rounded transition-colors"
                >
                  <FiTrash2 size={18} className="text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
