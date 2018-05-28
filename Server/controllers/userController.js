import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const secret = process.env.JWT_KEY;
const connectionString = process.env.DATABASE_URL;

class UserController {
  /**
     * Signs up a new User
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static signUp(req, res) {
    const client = new Client({
      connectionString,
    });

    client.connect();
    const {
      firstname, lastname, email, password,
    } = req.body.user;
    const queryString = {
      text: 'INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING id, firstname, lastname, email, createdat;',
      values: [firstname, lastname, email, password],
    };
    client.query(queryString, (error, result) => {
      client.end();
      if (error) {
        return res.status(400)
          .json({
            status: 'fail',
            code: 400,
            message: 'User sign up failed',
          });
      }
      const { id } = result.rows[0];
      return res.status(201)
        .json({
          status: 'success',
          code: 201,
          data: { fullname: `${firstname} ${lastname}`, email },
          token: jwt.sign({ id, email, admin: false }, secret, { expiresIn: '6h' }),
          message: 'User sign up successful',
        });
    });
  }

  /**
     * Authenticate User and returns a token
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static login(req, res) {
    const client = new Client({
      connectionString,
    });

    client.connect();
    const {
      email, password,
    } = req.body.user;
    const queryString = {
      text: 'SELECT id, admin, password FROM users WHERE email = $1 LIMIT 1;',
      values: [email],
    };
    client.query(queryString, (error, result) => {
      client.end();
      if (result.rows[0]) {
        const hashValue = bcrypt.compareSync(password, result.rows[0].password);
        if (hashValue) {
          const { id, admin } = result.rows[0];
          return res.status(200)
            .json({
              status: 'success',
              code: 200,
              token: jwt.sign({ id, email, admin }, secret, { expiresIn: '6h' }),
              message: 'User login successful',
            });
        }
        return res.status(401)
          .json({
            status: 'error',
            code: 401,
            message: 'User login failed, incorrect email or password',
          });
      }
      return res.status(401)
        .json({
          status: 'error',
          code: 401,
          message: 'User login failed, incorrect email or password',
        });
    });
  }
}

export default UserController;
