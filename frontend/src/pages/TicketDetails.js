import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import API_BASE_URL from '../config/api';

function CommentForm({ ticketId, onCommentAdded }) {
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${API_BASE_URL}/ticket/${ticketId}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Comment response:', res.data);
      onCommentAdded(res.data.comment || { text: comment, createdAt: new Date() });
      setComment('');
      setError('');
    } catch (err) {
      console.error('Comment error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to add comment');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      <textarea
        className="w-full border border-gray-300 rounded p-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your comment here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/ticket/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 👇 Check structure of response
        const ticketData = res.data.ticket || res.data; // support both { ticket: { ... } } or direct ticket object
        setTicket(ticketData);
        console.log('Ticket:', ticketData);
        console.log('Comments:', ticketData.comments);
      } catch (err) {
        console.error('Error fetching ticket:', err);
        setError('Ticket not found or unauthorized');
      }
    };

    fetchTicket();
  }, [id]);

  useEffect(() => {
    if (ticket) {
      document.title = `Ticket - ${ticket.title}`;
    }
  }, [ticket]);

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
          <div className="skeleton h-8 w-3/4 mb-4 rounded"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="skeleton h-4 w-1/2 mb-2 rounded"></div>
              <div className="skeleton h-4 w-1/3 mb-2 rounded"></div>
              <div className="skeleton h-4 w-2/3 mb-2 rounded"></div>
            </div>
            <div>
              <div className="skeleton h-4 w-1/2 mb-2 rounded"></div>
              <div className="skeleton h-4 w-3/4 mb-2 rounded"></div>
            </div>
          </div>

          <div className="mb-8">
            <div className="skeleton h-6 w-1/4 mb-2 rounded"></div>
            <div className="skeleton h-20 w-full rounded"></div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="skeleton h-10 w-32 rounded-lg"></div>
            <div className="skeleton h-10 w-28 rounded-lg"></div>
            <div className="skeleton h-10 w-24 rounded-lg"></div>
            <div className="skeleton h-10 w-20 rounded-lg"></div>
          </div>

          <div className="mt-8">
            <div className="skeleton h-6 w-1/3 mb-4 rounded"></div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded border">
                <div className="skeleton h-4 w-full mb-2 rounded"></div>
                <div className="skeleton h-4 w-3/4 mb-2 rounded"></div>
                <div className="skeleton h-3 w-1/4 rounded"></div>
              </div>
              <div className="bg-gray-50 p-4 rounded border">
                <div className="skeleton h-4 w-5/6 mb-2 rounded"></div>
                <div className="skeleton h-4 w-2/3 mb-2 rounded"></div>
                <div className="skeleton h-3 w-1/4 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">{ticket.title || 'Untitled Ticket'}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-700 mb-2"><strong>Status:</strong> {ticket.status || 'N/A'}</p>
            <p className="text-gray-700 mb-2"><strong>Priority:</strong> {ticket.priority || 'N/A'}</p>
            <p className="text-gray-700 mb-2">
              <strong>Created:</strong> {ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-700 mb-2">
              <strong>Updated:</strong> {ticket.updatedAt ? new Date(ticket.updatedAt).toLocaleString() : 'N/A'}
            </p>
            <p className="text-gray-700 mb-2"><strong>ID:</strong> {ticket._id || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {ticket.description || 'No description provided.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-slate-600 text-white px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors shadow-md"
          >
            <span className="text-lg">←</span>
            Back to Dashboard
          </button>

          {user?.role !== 'admin' && (
            <button
              onClick={() => navigate(`/tickets/edit/${ticket._id}`)}
              className="flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-lg hover:bg-amber-600 transition-colors shadow-md"
            >
              <span className="text-lg">✏️</span>
              Edit Ticket
            </button>
          )}

          {user?.role === 'admin' && (
            <button
              onClick={() => setShowCommentModal(true)}
              className="flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              <span className="text-lg">💬</span>
              Comments
            </button>
          )}

          <button
            onClick={async () => {
              const confirmDelete = window.confirm('Are you sure you want to delete this ticket?');
              if (!confirmDelete) return;

              try {
                const token = localStorage.getItem('token');
                await axios.delete(`${API_BASE_URL}/ticket/${ticket._id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                alert('Ticket deleted successfully');
                navigate('/dashboard');
              } catch (err) {
                console.error('Delete error:', err);
                alert('Failed to delete ticket');
              }
            }}
            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg hover:bg-red-600 transition-colors shadow-md"
          >
            <span className="text-lg">🗑️</span>
            Delete
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comments</h2>
          {ticket.comments && ticket.comments.length > 0 ? (
            <div className="space-y-4">
              {ticket.comments.map((comment, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded border">
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown date'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </div>
      </div>

      {showCommentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-blue-700">Comments</h2>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {ticket.comments && ticket.comments.length > 0 ? (
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
                {ticket.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded border">
                    <p className="text-gray-700">{comment.text}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : 'Unknown date'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-6">No comments yet.</p>
            )}

            <CommentForm 
              ticketId={ticket._id}
              onCommentAdded={(newComment) => {
                setTicket(prev => ({
                  ...prev,
                  comments: [...(prev.comments || []), newComment]
                }));
                setShowCommentModal(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TicketDetails;
