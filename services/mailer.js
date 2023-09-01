// mailer.js
const nodemailer = require("nodemailer");

async function sendEmail(recipientEmail, subject, text) {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: recipientEmail,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
