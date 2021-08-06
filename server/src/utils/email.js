const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url, token) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.token = token;
    this.from = `Admin <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //send grid
    } else {
      return nodemailer.createTransport({
        // service:'Gmail'
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER_NAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    }
  }

  async send(template, subject) {
    const html = pug.renderFile(`${__dirname}/templates/${template}.pug`, {
      from: this.from,
      url: this.url,
      token: this.token,
      subject,
    });
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: subject,
      html,
      // text: htmlToText(html),
    };
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to Natours');
  }

  async sendConfirmation() {
    await this.send(
      'confirmAccount',
      'Account confirmation - valid for 5 mins',
    );
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)',
    );
  }
};
