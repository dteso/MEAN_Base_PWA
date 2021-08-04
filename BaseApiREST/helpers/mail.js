const nodemailer = require('nodemailer');
const { mailServerConfig } = require('../config/mail-server-config');

const mailOptions = {
  from: '',
  to: '',
  subject: '',
  text: ''
};

const sendEmail = async (req, res) => {
  // 'transporter definition'
  const transporter = nodemailer.createTransport(mailServerConfig);

  // email sending
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      //res.send(500, err.message);
    } else {
      console.log("Accepted: " + info.accepted);
      console.log("messageId: " + info.messageId);
      //res.status(200).json(req.body);
    }
  });
};


/**
 * Sends a customizable mail.
 * @param {string} sender - Descriptor for who emits the message
 * @param {string} to - The message receiver email address.
 * @param {string} subject - The message subject.
 * @param {string} text - The message body.
 */
exports.sendCustomMail = (sender, to, subject, text) => {
  mailOptions.from = sender;
  mailOptions.to = to;
  mailOptions.subject = subject;
  mailOptions.text = text;
  sendEmail();
}