import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Low');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Open');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/ticket/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const ticketData = res.data.ticket || res.data;
        setTicket(ticketData);
        setTitle(ticketData.title || '');
        setPriority(ticketData.priority || 'Low');
        setDescription(ticketData.description || '');
        setStatus(ticketData.status || 'Open');
      } catch (err) {
        setError('Failed to load ticket');
      }
    };
    fetchTicket();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/ticket/${id}`, {
        title, priority, description, status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate(`/tickets/${id}`);
    } catch (err) {
      setError('Failed to update ticket');
    }
    setLoading(false);
  };

  if (!ticket) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Edit Ticket</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 rounded p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate(`/tickets/${id}`)}
              className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTicket;