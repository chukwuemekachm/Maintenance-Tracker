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
      if (result.rows.length > 0) {
        return res.status(200)
          .json({
            status: 'success',
            code: 200,
            data: result.rows,
            message: 'Requests exist for the user',
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
}

export default RequestController;
