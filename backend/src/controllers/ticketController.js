const Ticket = require('../models/ticket');

const allowedPriorities = ['Low', 'Medium', 'High'];
const allowedStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
const isValidationError = (error) => ['ValidationError', 'CastError'].includes(error?.name);

const createTicket = async (req, res) => {
    try {
       const { title, priority, description } = req.body;

        if (!title || title.trim().length < 3) {
            return res.status(400).json({ message: 'Title must contain at least 3 characters' });
        }
        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority' });
        }
        if (description && description.trim().length > 2000) {
            return res.status(400).json({ message: 'Description cannot exceed 2000 characters' });
        }
        
       const ticket = new Ticket({
        title,
        priority,
        description,
        comments: [],  // initialize as empty array
        user: req.user.userId
        });

        await ticket.save();
        res.status(201).json({ message: 'Ticket created successfully', ticket });
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(isValidationError(error) ? 400 : 500).json({ message: isValidationError(error) ? error.message : 'Internal Server Error' });
    }
};

const getAllTickets = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: 'Invalid user authentication' });
        }

        let tickets;
        if (req.user.role === 'admin') {
            tickets = await Ticket.find().populate('user', 'name email').sort({ createdAt: -1 });
        } else {
            tickets = await Ticket.find({ user: req.user.userId }).sort({ createdAt: -1 });
        }
        
        res.json({ 
            tickets, 
            count: tickets.length,
            userRole: req.user.role 
        });
    } catch (error) {
        console.error('Error fetching tickets:', {
            error: error.message,
            userId: req.user?.userId,
            userRole: req.user?.role
        });
        res.status(500).json({ message: 'Failed to fetch tickets', error: error.message });
    }
};

const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'Invalid ticket ID' });
        }
        
        let ticket;
        if (req.user.role === 'admin') {
            ticket = await Ticket.findById(id).populate('user', 'name email');
        } else {
            ticket = await Ticket.findOne({ _id: id, user: req.user.userId });
        }
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.json({ ticket });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const updateTicket = async (req, res) => {
    try {
        const { title, priority, description, status } = req.body;
        if (!title || title.trim().length < 3) {
            return res.status(400).json({ message: 'Title must contain at least 3 characters' });
        }
        if (priority && !allowedPriorities.includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority' });
        }
        if (status && !allowedStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const ticket = await Ticket.findOneAndUpdate(
            { _id: req.params.id, user: req.user.userId },
            { title, priority, description, status },
            { new: true }
        );
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        res.json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
        console.error('Error updating ticket:', error);
        res.status(isValidationError(error) ? 400 : 500).json({ message: isValidationError(error) ? error.message : 'Internal Server Error' });
    }
};
const addCommentToTicket = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admins can add comments' });
        }
        
        const { text } = req.body;
        if (!text || text.trim().length < 2 || text.trim().length > 1000) {
            return res.status(400).json({ message: 'Comment must contain 2 to 1000 characters' });
        }
        const ticket = await Ticket.findById(req.params.id);
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        const newComment = {
            text,
            createdAt: new Date()
        };
        
        ticket.comments.push(newComment);
        await ticket.save();
        
        res.json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const getTicketStats = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Invalid user authentication' });
    }

    let filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user.userId;
    }

    const groupedStats = await Ticket.aggregate([
      { $match: filter },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const counts = Object.fromEntries(groupedStats.map(({ _id, count }) => [_id, count]));
    const total = groupedStats.reduce((sum, item) => sum + item.count, 0);
    const open = counts.Open || 0;
    const inProgress = counts['In Progress'] || 0;
    const resolved = counts.Resolved || 0;
    const closed = counts.Closed || 0;

    res.status(200).json({ 
      total, open, inProgress, resolved, closed,
      userRole: req.user.role,
      scope: req.user.role === 'admin' ? 'all' : 'user'
    });
  } catch (err) {
    console.error('Error getting ticket stats:', {
      error: err.message,
      userId: req.user?.userId,
      userRole: req.user?.role
    });
    res.status(500).json({ message: 'Failed to get ticket stats', error: err.message });
  }
};

const deleteTicket = async (req, res) => {
    try {
        const ticket = await Ticket.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
        
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        
        res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        console.error('Error deleting ticket:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    updateTicket,
    deleteTicket,
    addCommentToTicket,
    getTicketStats
};
