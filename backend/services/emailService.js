// emailService.js (Email Verification and Notifications)
const nodemailer = require('nodemailer');

const sendVerificationEmail = async (email, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `<h2>Please click on the link to verify your email</h2>
               <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Verify Email</a>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent');
    } catch (error) {
        console.log('Error sending email', error);
    }
};

module.exports = sendVerificationEmail;
