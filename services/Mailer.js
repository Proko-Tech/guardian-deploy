const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const path = require('path');
const ejs = require('ejs');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL,
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

const transporter = nodemailer.createTransport(
    {
      host: 'smtp.gmail.com',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAILUSER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: oauth2Client.getAccessToken(),
      },
      secure: true,
    },
    {
      from: process.env.EMAILUSER,
    },
);

/**
 * Send text based email.
 * @param {object} emailPayload
 * @return {Promise<*>}
 */
async function sendTextEmail(emailPayload) {
  const mailOptions = {
    from: process.env.EMAILUSER,
    ...emailPayload,
  };
  return await transporter.sendMail(mailOptions);
}

/**
 * Send email with template.
 * @param {object} payload
 * @param {object} emailPayload
 * @return {Promise<void>}
 */
async function sendEmailTemplate(payload, emailPayload) {
  const html = await ejs.renderFile(
      path.join(__dirname, '..', 'templates/emailTemplate.ejs'),
      {payload: emailPayload});
  const mailOptions = {
    from: process.env.EMAILUSER, ...payload, html,
  };
  return await transporter.sendMail(mailOptions);
}

module.exports={sendTextEmail, sendEmailTemplate};
