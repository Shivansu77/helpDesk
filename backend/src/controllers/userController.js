const bcrypt = require('bcrypt');
const User = require('../models/user');
const { generateToken } = require('../jwt');

const validEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Register a new user
const registerUser = async (req, res) => {
    try {
        const { name, email, age, password, role } = req.body;

        if (!name || name.trim().length < 2) {
            return res.status(400).json({ message: 'Name must contain at least 2 characters' });
        }
        if (!validEmail(email)) {
            return res.status(400).json({ message: 'Please enter a valid email' });
        }
        if (typeof password !== 'string' || password.length < 8) {
            return res.status(400).json({ message: 'Password must contain at least 8 characters' });
        }
        if (age !== undefined && age !== '' && (!Number.isFinite(Number(age)) || Number(age) < 0)) {
            return res.status(400).json({ message: 'Age must be a positive number' });
        }
        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Create new user (password will be hashed by pre-save hook)
        const newUser = new User({
            name,
            email,
            age,
            password,
            role: role || 'user'
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        console.error('Register Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Log in user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateToken({ userId: user._id, email: user.email, role: user.role });
        res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get current user info
const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserInfo
};
