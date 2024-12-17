const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// const transporter = nodemailer.createTransport(
//     {
//         secure: true,
//         host: 'smtp.gmail.com',
//         port: 465,
//         auth:{
//             user: 'ankitasatdeve03@gmail.com',
//             pass:'aiogdsurncppotgs'
//         }
//     }
// )

// Create a transporter object
const transporter = nodemailer.createTransport({
    service: 'gmail', // Replace with your email service provider
    auth: {
        user: 'ankitasatdeve03@gmail.com',
        pass: 'aiogdsurncppotgs' // Use environment variables for security
    },
});

// const sendMail = (to, sub, msg) => {
//     transporter.sendMail({
//         to: to,
//         subject: sub,
//         html: msg
//     }, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//         } else {
//             console.log('Email sent successfully:', info);
//         }
//     });
// };

// sendMail("ankitasatdeve03@gmail.com","Shri Chakradhar Ishwar Bhakti","Trial Message")

// Endpoint to send an email
app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;

    const mailOptions = {
        from: 'your-email@example.com',
        to: to,
        subject: subject,
        text: text,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send({ error: error.message });
        }
        res.status(200).send({ message: 'Email sent successfully', info });
    });
});

