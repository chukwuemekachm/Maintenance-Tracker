import { Client } from 'pg';

import env from '../config/env';

const connectionString = env.databaseUrl;

/**
 * Checks if a user with the email already exists
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const signupCheck = (req, res, done) => {
  const queryString = {
    text: 'SELECT * FROM users WHERE email = $1',
    values: [req.body.user.email],
  };
  const client = new Client({
    connectionString,
  });

  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (result.rows[0]) {
      return res.status(409)
        .json({
          status: 'fail',
          code: 409,
          message: 'User with email exists',
        });
    }
    return done();
  });
};

export default signupCheck;
