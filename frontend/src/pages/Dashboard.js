import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

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
      await axios.post(
        `https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/ticket/${ticketId}/comment`,
        { text: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onCommentAdded();
      setComment('');
      setError('');
    } catch (err) {
      setError('Failed to add comment');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      <textarea
        className="w-full border border-gray-300 rounded p-3 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Write your comment here..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Comment'}
      </button>
    </form>
  );
}

function Dashboard() {
  const { user } = useContext(UserContext);
  const [ticketStats, setTicketStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  const [getAllTickets, setGetAllTickets] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [error, setError] = useState('');
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const navigate = useNavigate(); // ✅ FIXED: navigate is now defined

  useEffect(() => {
    let isMounted = true;
    
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch ticket stats
        const statsRes = await axios.get('https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/ticket/stats', { headers });
        if (isMounted) {
          setTicketStats(statsRes.data);
        }

        // Fetch all tickets
        const ticketsRes = await axios.get('https://help-desk-f75w0dmof-shivansu77s-projects.vercel.app/ticket/all-tickets', { headers });
        if (isMounted) {
          const tickets = ticketsRes.data.tickets || [];
          setGetAllTickets(tickets);
          setFilteredTickets(tickets);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Dashboard fetch error:', {
            message: err.message,
            status: err.response?.status,
            data: err.response?.data
          });
          
          if (err.response?.status === 401) {
            localStorage.removeItem('token');
            setError('Session expired. Please login again.');
          } else {
            setError(`Failed to load data: ${err.response?.data?.message || err.message}`);
          }
        }
      }
    };

    fetchDashboardData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter tickets based on search and filters
  useEffect(() => {
    if (!getAllTickets) return;
    
    let filtered = getAllTickets.filter(ticket => {
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
    
    setFilteredTickets(filtered);
  }, [getAllTickets, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="p-6">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <h1 className="text-3xl font-bold text-center mt-10">
        Welcome Back, {user ? user.name : 'Loading...'}
      </h1>

      {/* Ticket Stats */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          🎟️ {user?.role === 'admin' ? 'All System Tickets' : 'Your Tickets'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-blue-800">Total</h3>
            <p className="text-3xl font-bold text-blue-600">{ticketStats.total}</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-green-800">Open</h3>
            <p className="text-3xl font-bold text-green-600">{ticketStats.open}</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-yellow-800">In Progress</h3>
            <p className="text-3xl font-bold text-yellow-600">{ticketStats.inProgress}</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-purple-800">Resolved</h3>
            <p className="text-3xl font-bold text-purple-600">{ticketStats.resolved}</p>
          </div>
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
            <h3 className="text-lg font-medium text-red-800">Closed</h3>
            <p className="text-3xl font-bold text-red-600">{ticketStats.closed}</p>
          </div>
        </div>

        {/* Create New Ticket Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/add-ticket')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Create New Ticket
          </button>
        </div>
      </div>

      {/* Recent Tickets */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          📋 {user?.role === 'admin' ? 'All Tickets' : 'Recent Tickets'}
        </h2>
        
        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
              <div>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        {getAllTickets === null ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="skeleton h-5 w-3/4 rounded"></div>
                  <div className="skeleton h-6 w-16 rounded-full"></div>
                </div>
                <div className="mb-4">
                  <div className="skeleton h-4 w-full mb-2 rounded"></div>
                  <div className="skeleton h-4 w-5/6 mb-2 rounded"></div>
                  <div className="skeleton h-4 w-2/3 rounded"></div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="skeleton h-6 w-20 rounded"></div>
                  <div className="skeleton h-4 w-24 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <div className="skeleton h-8 flex-1 rounded"></div>
                  <div className="skeleton h-8 flex-1 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredTickets && filteredTickets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                className="bg-white border border-gray-200 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{ticket.title}</h3>
                    {user?.role === 'admin' && ticket.user && (
                      <p className="text-sm text-gray-500">By: {ticket.user.name}</p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ticket.status === 'Open'
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'In Progress'
                        ? 'bg-yellow-100 text-yellow-800'
                        : ticket.status === 'Resolved'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {ticket.description || 'No description'}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      ticket.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : ticket.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {ticket.priority} Priority
                  </span>
                  <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700"
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                  >
                    View Details
                  </button>
                  {user?.role === 'admin' && (
                    <button 
                      className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded text-sm hover:bg-gray-200"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowCommentModal(true);
                      }}
                    >
                      Add Comment
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : getAllTickets && getAllTickets.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tickets match your filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setPriorityFilter('All');
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 mr-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No tickets found.</p>
            <button
              onClick={() => navigate('/add-ticket')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Create Your First Ticket
            </button>
          </div>
        )}
      </div>

      {showCommentModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-blue-700">Add Comment</h2>
              <button
                onClick={() => setShowCommentModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">Ticket: {selectedTicket.title}</p>
            <CommentForm 
              ticketId={selectedTicket._id}
              onCommentAdded={() => {
                setShowCommentModal(false);
                setSelectedTicket(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
