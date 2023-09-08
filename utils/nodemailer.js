const nodemailer = require("nodemailer");

const sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    port: process.env.EMAIL_PORT.trim(),
    host: process.env.EMAIL_HOST.trim(),
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME.trim(),
      pass: process.env.EMAIL_PASSWORD.trim(),
    },
  });

  const mailOptions = {
    from: "Manish Chitre <manish@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendMail;
