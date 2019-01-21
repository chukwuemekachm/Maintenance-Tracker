import sendGrid from '@sendgrid/mail';
import { Client } from 'pg';

import env from '../config/env';

const { SENDGRID_API_KEY } = process.env;
const connectionString = env.databaseUrl;

/**
 * Sends email notifications to admin and users
 *
 * @class - The EmailSender class
 */
class EmailSender {
  /**
   * Sends an email to a recipient
   *
   * @param {String} userEmail - The email address of the recipent
   * @param {String} mailSubject - The subject of the mail
   * @param {String} mailBody - The mail/message body
   */
  static async sendEmail(userEmail, mailSubject, mailBody) {
    const message = {
      from: 'no-reply@maintenance-tracker',
      to: userEmail,
      subject: mailSubject,
      html: `<h3 style="grey: white;padding: .5em;">Maintenance Tracker</h3>
      <div style="padding: .5em;">${mailBody}</div>
      <p style="padding: .5em;"><b>**Note if you are not subscribed to Maintenance Tracker, please ignore this mail.</p>`,
    };

    sendGrid.setApiKey(SENDGRID_API_KEY);
    sendGrid.send(message).then(() => true);
  }

  /**
   * Constructs the message body of a user email notification,
   * when a request is approved, disapproved or resolved
   *
   * @param {Number} requestId - The request id of the modified request
   */
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
      const messageBody = `<p>Dear <b>${lastname}</b>,</p> <p>Your request with</p> <p>Request ID: <b>${requestId}</b>, <p>Request Title: <b>${title}</p>, <p> Created on: <b>${createdat}</b>, <p> was ${status} on <b>${new Date(updatedat)}</b>.</p>`;
      EmailSender.sendEmail(email, `Request ${status}`, messageBody);
    });
  }

  /**
   * Constructs the message body of an admin email notification, when a request is created
   *
   * @param {String} requestTitle - The title of the created request
   */
  static async userCreateRequest(requestTitle) {
    const client = new Client({
      connectionString,
    });
    client.connect();
    const queryString = 'SELECT email, lastname from users WHERE admin = TRUE;';
    client.query(queryString, (error, result) => {
      client.end();
      const { email, lastname } = result.rows[0];
      const messageBody = `<p>Dear <b>${lastname}</b>, <p>A new request with<p/> <p>Request Title: <b>${requestTitle}</b>,</p> <p>was logged on <b>${new Date()}</b>.</p>`;
      EmailSender.sendEmail(email, 'Request logged', messageBody);
    });
  }
}

export default EmailSender;
