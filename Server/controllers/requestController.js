import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

class RequestController {
  /**
     * Gets all the requests of the authenticated user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static getUserRequests(req, res) {
    const { id } = req.body.token;
    const queryString = {
      text: 'SELECT * FROM requests WHERE user_id = $1;',
      values: [id],
    };
    const client = new Client({
      connectionString,
    });
    client.connect();
    client.query(queryString, (error, result) => {
      client.end();
      if (result.rows.length > 0) {
        return res.status(200)
          .json({
            status: 'success',
            code: 200,
            data: result.rows,
            message: 'Requests retrieved successfully',
          });
      }
      return res.status(404)
        .json({
          status: 'fail',
          code: 404,
          message: 'No request for the user',
        });
    });
  }

  /**
     * Gets the details of a single request, of the authenticated user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static getUserRequest(req, res) {
    const { id } = req.body.token;
    const { requestId } = req.params;
    const queryString = {
      text: 'SELECT * FROM requests WHERE user_id = $1 AND id = $2 LIMIT 1;',
      values: [id, requestId],
    };
    const client = new Client({
      connectionString,
    });
    client.connect();
    client.query(queryString, (error, result) => {
      client.end();
      if (result.rows[0]) {
        return res.status(200)
          .json({
            status: 'success',
            code: 200,
            data: result.rows,
            message: 'Request retrieved successfully',
          });
      }
      return res.status(404)
        .json({
          status: 'fail',
          code: 404,
          message: 'Request does not exist for the user',
        });
    });
  }

  /**
     * Creates a new request for the authenticated user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static createRequest(req, res) {
    const { id } = req.body.token;
    const { title, type, description } = req.body.request;
    const queryString = {
      text: 'INSERT INTO requests(title, type, description, user_id, status) VALUES($1, $2, $3, $4, $5) RETURNING id, title, type, description, status, createdat',
      values: [title, type, description, id, 'pending'],
    };
    const client = new Client({
      connectionString,
    });
    client.connect();
    client.query(queryString, (error, result) => {
      client.end();
      if (result) {
        return res.status(201)
          .json({
            status: 'success',
            code: 201,
            data: result.rows[0],
            message: 'Request created successfully',
          });
      }
      return res.status(417)
        .json({
          status: 'failed',
          code: 417,
          error,
          message: 'Request creation failed',
        });
    });
  }

  /**
     * Upadtes the details of a request
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static updateUserRequest(req, res) {
    const { title, type, description } = req.body.request;
    const id = parseInt(req.params.requestId, 10);
    const queryString = {
      text: 'UPDATE requests SET title = $1, type = $2, description = $3, updatedat = NOW() WHERE id = $4 RETURNING id, title, type, description, updatedat;',
      values: [title, type, description, id],
    };
    const client = new Client({
      connectionString,
    });
    client.connect();
    client.query(queryString, (error, result) => {
      client.end();
      return res.status(200)
        .json({
          status: 'success',
          code: 200,
          data: result.rows[0],
          message: 'Request updated successfully',
        });
    });
  }
}

export default RequestController;
