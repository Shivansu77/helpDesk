const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserInfo } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

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

module.exports = router;
