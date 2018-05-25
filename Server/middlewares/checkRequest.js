import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

/**
   * Gets all the requests of the authenticated user
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {object} next - The next middleware
   */
const requestCheck = (req, res, next) => {
  const { requestId } = req.params;
  const queryString = {
    text: 'SELECT * FROM requests WHERE id = $1 LIMIT 1;',
    values: [requestId],
  };
  const client = new Client({
    connectionString,
  });
  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (result.rows[0]) {
      return next();
    }
    return res.status(404)
      .json({
        status: 'error',
        code: 404,
        message: 'Request does not exist',
      });
  });
};

export default requestCheck;
