import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

class AdminController {
  /**
     * Gets all the requests on the system
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static getRequests(req, res) {
    const queryString = 'SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id ORDER BY request_id';
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
          data: result.rows,
          message: 'Requests on the system retrieved successfully',
        });
    });
  }

  /**
     * Modifies the status of a request to approve
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static approveRequest(req, res) {
    const { requestId } = req.params;
    const queryString = {
      text: 'UPDATE requests SET status = $1, updatedat = NOW() WHERE id = $2 RETURNING id, title, type, description, status, updatedat;',
      values: ['approved', requestId],
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
          message: 'Request approved successfully',
        });
    });
  }

  /**
     * Modifies the status of a request to disapprove
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static disapproveRequest(req, res) {
    const { requestId } = req.params;
    const queryString = {
      text: 'UPDATE requests SET status = $1, updatedat = NOW() WHERE id = $2 RETURNING id, title, type, description, status, updatedat;',
      values: ['disapproved', requestId],
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
          message: 'Request disapproved successfully',
        });
    });
  }

  /**
     * Modifies the status of a request to resolve
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static resolveRequest(req, res) {
    const { requestId } = req.params;
    const queryString = {
      text: 'UPDATE requests SET status = $1, updatedat = NOW() WHERE id = $2 RETURNING id, title, type, description, status, updatedat;',
      values: ['resolved', requestId],
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
          message: 'Request resolved successfully',
        });
    });
  }
}

export default AdminController;
