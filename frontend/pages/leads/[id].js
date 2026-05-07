import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { leadsAPI, notesAPI } from '@/lib/api';
import { FiTrash2 } from 'react-icons/fi';

export default function LeadDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [lead, setLead] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => {
    if (id) {
      loadLead();
    }
  }, [id]);

  const loadLead = async () => {
    try {
      const response = await leadsAPI.getById(id);
      setLead(response.data);
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Failed to load lead:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteContent.trim()) {
      alert('Please enter a note');
      return;
    }

    try {
      setAddingNote(true);
      await notesAPI.add(id, noteContent);
      setNoteContent('');
      loadLead();
    } catch (error) {
      console.error('Failed to add note:', error);
      alert('Failed to add note');
    } finally {
      setAddingNote(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await notesAPI.delete(noteId);
        loadLead();
      } catch (error) {
        console.error('Failed to delete note:', error);
        alert('Failed to delete note');
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Loading lead...</div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  if (!lead) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-600">Lead not found</div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-between items-start mb-8">
            <div>
              <Link href="/leads" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Leads
              </Link>
              <h1 className="text-4xl font-bold text-gray-800">{lead.name}</h1>
              <p className="text-gray-600 mt-2">{lead.company_name || 'No company'}</p>
            </div>
            <Link href={`/leads/${id}/edit`} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-all">
              Edit Lead
            </Link>
          </div>

          {/* Lead Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{lead.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">{lead.phone_number || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Company</p>
                  <p className="text-gray-900">{lead.company_name || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Lead Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-gray-900 font-semibold">{lead.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lead Source</p>
                  <p className="text-gray-900">{lead.lead_source}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Deal Value</p>
                  <p className="text-gray-900 font-semibold">${lead.deal_value}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Notes</h2>

            {/* Add Note Form */}
            <div className="mb-6 pb-6 border-b">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                rows="3"
              />
              <button
                onClick={handleAddNote}
                disabled={addingNote}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
              >
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>

            {/* Notes List */}
            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-gray-600">No notes yet</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">{note.creator_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{new Date(note.created_at).toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
