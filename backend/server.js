const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User'); // Assuming you have a User model defined
const bcrypt = require('bcryptjs');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => console.log('MongoDB connection error: ', err));

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use true for port 465
    auth: {
        user: process.env.EMAIL_USERNAME,  // Your email
        pass: process.env.EMAIL_PASSWORD,  // Your app password or OAuth token
    },
});

// Function to send an email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"Eleanor Web Text" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
        html: html, // html body
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// Test Route for Sending Email
app.get('/test-email', async (req, res) => {
    try {
        await sendEmail(
            'eleanortefera12@gmail.com', // Change this to your test email address
            'Test Email Subject',
            'This is a test email sent from Node.js using Nodemailer.',
            '<b>This is a test email sent from Node.js using Nodemailer.</b>'
        );
        res.send('Test email sent successfully!');
    } catch (error) {
        res.status(500).send('Failed to send email');
    }
});

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Send confirmation email
        await sendEmail(email, 'Registration Successful', 'Welcome! You have successfully registered.');

        res.status(201).send('Registration successful! Please check your email.');
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).send('Server error');
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).send('Invalid credentials');
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
        
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).send('Server error');
    }
});

// Protected Route Example
app.get('/dashboard', authenticateJWT, (req, res) => {
    res.send('This is the dashboard. Only authenticated users can see this.');
});

// Middleware for JWT authentication
function authenticateJWT(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Bearer token

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }
            req.user = user; // Save user information for later use
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
