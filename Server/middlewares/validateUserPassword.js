import Joi from 'joi';
import bcrypt from 'bcrypt';
import { Client } from 'pg';

import env from '../config/env';

const connectionString = env.databaseUrl;

const updatePasswordSchema = Joi.object().keys({
  oldpassword: Joi.string().required(),
  newpassword: Joi.string().required(),
  confirmpassword: Joi.string().required(),
});

const verifiedPasswordInputSchema = Joi.object().keys({
  oldpassword: Joi.string().required(),
  newpassword: Joi.string().required().min(5).max(10)
    .regex(/^[a-zA-Z0-9]{5,10}$/),
  confirmpassword: Joi.string().required().min(5).max(10)
    .equal(Joi.ref('newpassword')),
});

/**
 * Validates the user inputs in the request payload to modify the password of the authenticated user
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} done - The next middleware to be called
 */
const comparePasswords = (req, res, done) => {
  const client = new Client({
    connectionString,
  });
  const { id: userId } = req.body.token;
  const { oldpassword, newpassword } = req.body.modifiedPasswords;
  const queryString = {
    text: 'SELECT password FROM users WHERE id = $1 LIMIT 1;',
    values: [userId],
  };

  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    const hashValue = bcrypt.compareSync(oldpassword, result.rows[0].password);
    if (!hashValue) return res.status(400).json({ status: 'error', code: 400, message: 'Password is incorrect' });
    req.body.newPassword = bcrypt.hashSync(newpassword, 10);
    return done();
  });
};

/**
 * Validates the user inputs in the request payload to modify the password of the authenticated user
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} done - The next middleware to be called
 */
const validateNewPassword = (req, res, done) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;
  const userPasword = { oldpassword, newpassword, confirmpassword };

  Joi.validate(userPasword, updatePasswordSchema, (err) => {
    if (err) return res.status(400).json({ status: 'error', code: 400, message: err.details[0].message.replace(/"/g, '') });
    const modifiedPasswords = {
      oldpassword: oldpassword.replace(/  +/g, '').trim(),
      newpassword: newpassword.replace(/  +/g, '').trim(),
      confirmpassword: confirmpassword.replace(/  +/g, '').trim(),
    };

    Joi.validate(modifiedPasswords, verifiedPasswordInputSchema, (error) => {
      if (error) return res.status(422).json({ status: 'error', code: 422, message: error.details[0].message.replace(/"/g, '') });
      req.body.modifiedPasswords = modifiedPasswords;
      return done();
    });
    return true;
  });
};

export { validateNewPassword, comparePasswords };
