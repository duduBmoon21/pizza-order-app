const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('./models/User'); // Assuming you have a User model defined
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => console.log(err));

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, // e.g., 'gmail'
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL_USERNAME,  // Your email
        pass: process.env.EMAIL_PASSWORD,  // Your app password or OAuth token
    },
});


// Function to send an email
const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: `"Eleanor Web Text" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: "eleanortefera12@gmail.com", // list of receivers
        subject: "send mssg using NodeMailer and Gmail", // Subject line
        text: "Hello World!", // plain text body
        html: "<b> My Mssg</b>", // 
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

// User Registration Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create a new user
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Send confirmation email
        sendEmail(email, 'Registration Successful', 'Welcome! You have successfully registered.');

        res.status(201).send('Registration successful! Please check your email.');
    } catch (error) {
        console.error(error);
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
        console.error(error);
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
