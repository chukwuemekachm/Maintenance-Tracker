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
      text: 'INSERT INTO users(firstname, lastname, email, password) VALUES($1, $2, $3, $4) RETURNING id, firstname, lastname, email, admin, createdat;',
      values: [firstname, lastname, email, password],
    };
    client.query(queryString, (error, result) => {
      client.end();
      const { id, admin } = result.rows[0];
      return res.status(201)
        .json({
          status: 'success',
          code: 201,
          data: {
            admin, firstname, lastname, email,
          },
          token: jwt.sign({ id, email, admin: false }, secret, { expiresIn: '72h' }),
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
      text: 'SELECT id, admin, firstname, lastname, password FROM users WHERE email = $1 LIMIT 1;',
      values: [email],
    };
    client.query(queryString, (error, result) => {
      client.end();
      if (result.rows[0]) {
        const hashValue = bcrypt.compareSync(password, result.rows[0].password);
        if (hashValue) {
          const {
            id, admin, firstname, lastname,
          } = result.rows[0];
          return res.status(200)
            .json({
              status: 'success',
              code: 200,
              data: {
                admin, firstname, lastname, email,
              },
              token: jwt.sign({ id, email, admin }, secret, { expiresIn: '72h' }),
              message: 'User login successful',
            });
        }
        return res.status(401)
          .json({
            status: 'error',
            code: 401,
            message: 'User login failed, incorrect password',
          });
      }
      return res.status(401)
        .json({
          status: 'error',
          code: 401,
          message: 'User login failed, email does not exist',
        });
    });
  }

  /**
     * Returns the account/profile details of the authenticated user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  static userProfile(req, res) {
    const client = new Client({
      connectionString,
    });
    const { id } = req.body.token;

    client.connect();
    const queryString = {
      text: 'SELECT firstname, lastname, email, admin, createdat, updatedat FROM users WHERE id = $1;',
      values: [id],
    };
    client.query(queryString, (error, result) => {
      client.end();
      const {
        firstname, lastname, email, admin, createdat, updatedat,
      } = result.rows[0];
      return res.status(200)
        .json({
          status: 'success',
          code: 200,
          data: {
            firstname, lastname, email, admin, createdat, updatedat,
          },
          message: 'User details retrieved successfully',
        });
    });
  }

  /**
     * Updates the password of the authenticated user
     *
     * @param {Object} req - The request object received
     * @param {Object} res - The response object sent
     *
     * @returns {Object}
     */
  static updatePassword(req, res) {
    const client = new Client({
      connectionString,
    });
    const { id } = req.body.token;
    const { newPassword } = req.body;

    client.connect();
    const queryString = {
      text: 'UPDATE users SET password = $1 WHERE id = $2;',
      values: [newPassword, id],
    };
    client.query(queryString, () => {
      client.end();
      return res.status(200)
        .json({
          status: 'success',
          code: 200,
          message: 'User password updated successfully',
        });
    });
  }

  /**
     * Updates the profile of the authenticated user
     *
     * @param {Object} req - The request object received
     * @param {Object} res - The response object sent
     *
     * @returns {Object}
     */
  static updateProfile(req, res) {
    const client = new Client({
      connectionString,
    });
    const { id } = req.body.token;
    const { firstname, lastname } = req.body.profile;

    client.connect();
    const queryString = {
      text: 'UPDATE users SET firstname = $1, lastname = $2, updatedat = NOW() WHERE id = $3 RETURNING firstname, lastname, email, createdat, updatedat',
      values: [firstname, lastname, id],
    };
    client.query(queryString, (error, result) => {
      client.end();
      return res.status(200)
        .json({
          status: 'success',
          code: 200,
          data: result.rows[0],
          message: 'User profile updated successfully',
        });
    });
  }
}

export default UserController;
