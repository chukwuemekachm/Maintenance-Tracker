import Joi from 'joi';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const updateProfileSchema = Joi.object().keys({
  firstname: Joi.string().min(2).max(15).regex(/^[a-zA-Z\s]{2,15}$/)
    .optional(),
  lastname: Joi.string().min(2).max(15).regex(/^[a-zA-Z\s]{2,15}$/)
    .optional(),
});

/**
 * Creates the details of the user from the updated values or existing ones
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} done - The next middleware to be called
 */
const processUpdatedProfile = (req, res, done) => {
  const client = new Client({
    connectionString,
  });
  const { id: userId } = req.body.token;
  const { firstname: oldFirstname, lastname: oldLastName } = req.body.profile;
  const queryString = {
    text: 'SELECT * FROM users WHERE id = $1 LIMIT 1;',
    values: [userId],
  };

  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    const { firstname, lastname } = result.rows[0];
    req.body.profile = {
      firstname: oldFirstname || firstname,
      lastname: oldLastName || lastname,
    };
    return done();
  });
};

/**
 * Validates the user inputs in the request payload to modify the profile of the authenticated user
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Object} done - The next middleware to be called
 */
const validateUserProfile = (req, res, done) => {
  const { firstname, lastname } = req.body;
  const userProfile = { firstname, lastname };

  Joi.validate(userProfile, updateProfileSchema, (err) => {
    if (err) return res.status(400).json({ status: 'error', code: 400, message: err.details[0].message.replace(/"/g, '') });
    const modifiedProfile = {
      firstname: firstname ? firstname.replace(/  +/g, '').trim() : null,
      lastname: lastname ? lastname.replace(/  +/g, '').trim() : null,
    };
    req.body.profile = modifiedProfile;
    return done();
  });
};

export { validateUserProfile, processUpdatedProfile };
