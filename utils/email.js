require("dotenv").config();
const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY,
});

const sendWelcomeEmail = async (toEmail, name, html) => {
  try {
    const sentFrom = new Sender(
      "test@trial-3yxj6lje78xgdo2r.mlsender.net",
      "Gossip_Me"
    );

    const recipients = [new Recipient(toEmail, name)];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Welcome to Gossip_Me!")
      .setHtml(html);

    await mailerSend.email.send(emailParams);
    console.log("Email sent to:", toEmail);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

module.exports = { sendWelcomeEmail };
