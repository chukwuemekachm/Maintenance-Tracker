import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const mailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASSWORD,
  },
});

class EmailSender {
  static async sendEmail(userEmail, mailSubject, mailBody) {
    const mailOptions = {
      from: 'Maintenance-Tracker.com',
      to: userEmail,
      subject: mailSubject,
      html: `<h1 style="grey: white;padding: .5em;">Maintenance Tracker</h1>
      <p style="padding: .5em;">${mailBody}</p>`,
    };

    mailTransporter.sendMail(mailOptions, (err) => {
      if (err) {
        return false;
      }
      return true;
    });
  }

  static async userRequestStatus(requestId) {
    const client = new Client({
      connectionString,
    });
    client.connect();
    const queryString = {
      text: 'SELECT requests.id, requests.title, requests.createdat, requests.status, requests.updatedat, users.lastname, users.email FROM requests INNER JOIN users ON users.id = requests.user_id WHERE requests.id = $1 LIMIT 1;',
      values: [requestId],
    };
    client.query(queryString, (error, result) => {
      client.end();
      const {
        title, createdat, updatedat, status, lastname, email,
      } = result.rows[0];
      const messageBody = `Dear ${lastname}, <br /><br /> You request with <br /> Request ID: <b>${requestId}</b>, <br /> Request Title: <b>${title}</b>, <br /> Created on: <b>${createdat}</b>, <br /> was ${status} on <b>${new Date(updatedat)}</b>.`;
      EmailSender.sendEmail(email, `Request ${status}`, messageBody);
    });
  }
}

export default EmailSender;
