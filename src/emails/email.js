const sgMail = require("@sendgrid/mail");

const apiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(apiKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    from: "alibinaliay@gmail.com",
    to: email,
    subject: "welcome",
    text: `Welcome ${name}`
  });
};
const sendCancellationEmail = (email, name) => {
  sgMail.send({
    from: "alibinaliay@gmail.com",
    to: email,
    subject: "welcome",
    text: `Hi ${name}`
  });
};
module.exports = { sendWelcomeEmail, sendCancellationEmail };
