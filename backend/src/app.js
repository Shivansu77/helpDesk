require('dotenv').config();

// Set default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'fallback-secret-key-change-in-production';
}
require('./appMongoose');
const express = require('express');
const cors = require('cors');
const app = express();
const PORT =process.env.PORT || 8000;
const userRouter = require('./routes/userRoutes');
const ticketRouter = require('./routes/ticketRoutes');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.use('/ticket',ticketRouter);
app.use('/user', userRouter);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});