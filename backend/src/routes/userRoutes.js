const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserInfo } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user');

router.post('/login', loginUser);
router.post('/register', registerUser);
router.get('/me', authMiddleware, getUserInfo);
router.get('/all',authMiddleware,async(req,res)=>{
    try {
    const users = await require('../models/user').find({}, 'name email _id');
    res.json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Create admin user for testing
router.post('/create-admin', async (req, res) => {
    try {
        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@test.com',
            age: 30,
            password: 'admin123',
            role: 'admin'
        });
        await adminUser.save();
        res.json({ message: 'Admin user created', user: { name: adminUser.name, email: adminUser.email, role: adminUser.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = router;
