import Joi from 'joi';
import bcrypt from 'bcrypt';

const signupSchema = Joi.object().keys({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Validates user inputs in request payload for Uuser
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const signup = (req, res, done) => {
  const {
    firstname, lastname, email, password,
  } = req.body;
  if (!firstname || typeof firstname !== 'string' || !/^[a-zA-Z]{1,}$/.test(firstname)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'firstname is required or invalid',
    });
  }
  if (!lastname || typeof lastname !== 'string' || !/^[a-zA-Z]{1,}$/.test(lastname)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'lastname is required or invalid',
    });
  }
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'email is required or invalid',
    });
  }
  if (!password || typeof password !== 'string' || !/^[a-zA-Z0-9]{1,}$/.test(password)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'password is required or invalid',
    });
  }

  const user = {
    firstname: firstname.replace(/  +/g, '').trim(),
    lastname: lastname.replace(/  +/g, '').trim(),
    email: email.replace(/  +/g, '').trim(),
    password: password.replace(/  +/g, '').trim(),
  };

  Joi.validate(user, signupSchema, (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: err.details[0].message,
      });
    }
    user.password = bcrypt.hashSync(user.password, 10);
    req.body.user = user;
    return true;
  });
  return done();
};

/**
 * Validates user inputs in request payload for login
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const login = (req, res, done) => {
  const {
    email, password,
  } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'email is required or invalid',
    });
  }
  if (!password || typeof password !== 'string' || !/^[a-zA-Z0-9]{1,}$/.test(password)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'password is required or invalid',
    });
  }

  const user = {
    email: email.replace(/  +/g, '').trim(),
    password: password.replace(/  +/g, '').trim(),
  };

  Joi.validate(user, loginSchema, (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: err.details[0].message,
      });
    }
    req.body.user = user;
    return true;
  });
  return done();
};

export { signup, login };
