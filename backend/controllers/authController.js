// authController.js (Authentication Logic)
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/jwt');
const sendVerificationEmail = require('../services/emailService');

const registerUser = async (req, res) => {
    const { fullname, username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            fullname,
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const token = generateToken(newUser._id, newUser.isAdmin);
        await sendVerificationEmail(email, token);

        res.status(201).json({
            message: 'Registration successful. Please check your email for verification.',
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id, user.isAdmin);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
};
