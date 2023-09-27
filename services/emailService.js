// mailer.js
const nodemailer = require("nodemailer");

async function sendEmailService(recipientEmail, subject, html) {
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
    html,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEmailService };
