// const nodemailer = require("nodemailer");

// const sendEmail = async (options) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 465,
//       secure: true,
//       auth: {
//         user: process.env.SMTP_EMAIL,
//         pass: process.env.SMTP_PASSWORD,
//       },
//     });

//     const mailOptions = {
//       from: "WhisperZone <yekeen244@gmail.com>",
//       to: options.email,
//       subject: options.subject,
//       text: options.message,
//       html: options.html,
//     };

//     await transporter.sendMail(mailOptions);
//   } catch (error) {
//     throw new Error("Email could not be sent.");
//   }
// };

// module.exports = sendEmail;
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // Add this for better deliverability
      pool: true,
      rateDelta: 1000, // Space out emails by 1 second
      rateLimit: 5, // Max 5 messages per second
    });

    // Most important change - match "from" with your actual sending email
    const mailOptions = {
      from: `"WhisperZone" <${process.env.SMTP_EMAIL}>`, // Must match your auth.user
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
      // Optional but helpful
      replyTo: process.env.SMTP_EMAIL,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email error:", error);
    throw new Error("Email could not be sent.");
  }
};

module.exports = sendEmail;
