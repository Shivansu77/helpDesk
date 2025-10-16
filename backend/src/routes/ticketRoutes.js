const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createTicket, getAllTickets, getTicketById, updateTicket, deleteTicket, addCommentToTicket ,getTicketStats} = require('../controllers/ticketController');

router.post('/add-ticket', authMiddleware, createTicket);
router.post('/:id/comment', authMiddleware, addCommentToTicket);
router.get('/all-tickets', authMiddleware, getAllTickets);
router.get('/stats', authMiddleware, getTicketStats);
router.get('/:id', authMiddleware, getTicketById);
router.put('/:id', authMiddleware, updateTicket);
router.delete('/:id', authMiddleware, deleteTicket);
router.post('/:id/comment', authMiddleware, addCommentToTicket);

module.exports = router;