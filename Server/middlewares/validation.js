import Joi from 'joi';
import bcrypt from 'bcrypt';

const signupSchema = Joi.object().keys({
  firstname: Joi.string().required().max(25),
  lastname: Joi.string().required().max(25),
  email: Joi.string().email().required().max(60)
    .regex(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/)
    .error(new Error('The email is not valid')),
  password: Joi.string().required().max(15),
});

const loginSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createRequestSchema = Joi.object().keys({
  title: Joi.string().required().min(3).max(50),
  type: Joi.string().required().max(15),
  description: Joi.string().required().min(10).max(150),
});

const filterRequestSchema = Joi.object().keys({
  filterType: Joi.string(),
  pageNo: Joi.number().positive().integer(),
});

/**
 * Validates if a type property in the request payload is equal to repair or maintenance
 *
 * @param {string} type - The type parameter
 *
 * @param {boolean} - The value returned
 */
const checkType = (type) => {
  if (type.toLowerCase() === 'repair' || type.toLowerCase() === 'maintenance') { return true; }
  return false;
};

/**
 * Trims and validates the user values in payload
 *
 * @param {string} firstname - The firstname of the user
 * @param {string} lastname - The lasttname of the user
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware
 */
const trimUser = (firstname, lastname, email, password, req, res, done) => {
  const user = {
    firstname: firstname.replace(/  +/g, '').trim(),
    lastname: lastname.replace(/  +/g, '').trim(),
    email: email.replace(/  +/g, '').trim(),
    password: password.replace(/  +/g, '').trim(),
  };
  Joi.validate(user, signupSchema, (err) => {
    if (!err) {
      user.password = bcrypt.hashSync(user.password, 10);
      req.body.user = user;
      return done();
    }
    return res.status(422).json({
      status: 'error',
      code: 422,
      message: err.details ? err.details[0].message : err.message,
    });
  });
};

/**
 * Trims and validates the user values in payload
 *
 * @param {string} title - The title of the request
 * @param {string} type - The type of the request
 * @param {string} description - The description of the request
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware
 */
const trimRequest = (title, type, description, req, res, done) => {
  const request = {
    title: title.replace(/  +/g, ' ').trim(),
    type: type.replace(/  +/g, '').trim(),
    description: description.replace(/  +/g, ' ').trim(),
  };
  Joi.validate(request, createRequestSchema, (err) => {
    if (err) {
      return res.status(400).json({ status: 'error', code: 400, message: err.details[0].message });
    }
    req.body.request = request;
    return true;
  });
  return done();
};

/**
 * Validates user inputs in request payload for Uuser
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const signup = (req, res, done) => {
  const {
    firstname,
    lastname,
    email,
    password,
  } = req.body;
  if (!firstname || typeof firstname !== 'string') {
    return res.status(400).json({ status: 'error', code: 400, message: 'firstname is required or invalid' });
  }
  if (!lastname || typeof lastname !== 'string') {
    return res.status(400).json({ status: 'error', code: 400, message: 'lastname is required or invalid' });
  }
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ status: 'error', code: 400, message: 'email is required or invalid' });
  }
  if (!password || typeof password !== 'string' || !/^[a-zA-Z0-9]{1,}$/.test(password)) {
    return res.status(400).json({ status: 'error', code: 400, message: 'password is required or invalid' });
  }
  trimUser(firstname, lastname, email, password, req, res, done);
  return true;
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
    email,
    password,
  } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ status: 'error', code: 400, message: 'email is required or invalid' });
  }
  if (!password || typeof password !== 'string' || !/^[a-zA-Z0-9]{1,}$/.test(password)) {
    return res.status(400).json({ status: 'error', code: 400, message: 'password is required or invalid' });
  }
  const user = {
    email: email.replace(/  +/g, '').trim(),
    password: password.replace(/  +/g, '').trim(),
  };
  Joi.validate(user, loginSchema, (err) => {
    if (err) {
      return res.status(400).json({ status: 'error', code: 400, message: err.details[0].message });
    }
    req.body.user = user;
    return true;
  });
  return done();
};

/**
 * Validates requestId in request route parameters
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const checkRequestId = (req, res, done) => {
  const { requestId } = req.params;
  if (!requestId || !/^[0-9]{1,}$/.test(requestId) || Number.isNaN(requestId)) {
    return res.status(400).json({ status: 'error', code: 400, message: 'requestId is not valid' });
  }
  return done();
};

/**
 * Validates user inputs in request payload for creation of new request
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const createRequest = (req, res, done) => {
  const {
    title,
    type,
    description,
  } = req.body;
  if (!title || typeof title !== 'string' || !/^[a-zA-Z0-9\s]{1,}$/.test(title)) {
    return res.status(400).json({ status: 'error', code: 400, message: 'title is required or invalid' });
  }
  if (!type || typeof type !== 'string' || !/^[a-zA-Z\s]{1,}$/.test(type) || !checkType(type)) {
    return res.status(400).json({ status: 'error', code: 400, message: 'type is required or invalid, it must be a "repair" or a "maintenance"' });
  }
  if (!description || typeof description !== 'string') {
    return res.status(400).json({ status: 'error', code: 400, message: 'description is required or invalid' });
  }
  trimRequest(title, type, description, req, res, done);
  return true;
};

/**
 * Validates user inputs in request payload for updating a book
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const updateRequest = (req, res, done) => {
  if (req.body.title) {
    req.body.title = req.body.title.replace(/  +/g, ' ').trim();
    if (typeof req.body.title !== 'string' || !/^[a-zA-Z0-9\s,]{1,}$/.test(req.body.title) || req.body.title.length < 2) {
      return res.status(400).json({ status: 'error', code: 400, message: 'title is invalid' });
    }
  }
  if (req.body.type) {
    req.body.type = req.body.type.replace(/  +/g, '').trim();
    if (typeof req.body.type !== 'string' || !/^[a-zA-Z]{1,}$/.test(req.body.type) || !checkType(req.body.type)) {
      return res.status(400).json({ status: 'error', code: 400, message: 'type is invalid, it must be a "repair" or a "maintenance"' });
    }
  }
  if (req.body.description) {
    req.body.description = req.body.description.replace(/  +/g, ' ').trim();
    if (typeof req.body.description !== 'string' || !/^[a-zA-Z0-9,\.\s]{1,}$/.test(req.body.description)) {
      return res.status(400).json({ status: 'error', code: 400, message: 'description is invalid' });
    }
  }
  if (!req.body.title && !req.body.type && !req.body.description) {
    return res.status(400).json({ status: 'error', code: 400, message: 'You have made no changes' });
  }
  return done();
};

/**
 * Validates query params in request payload for admin get all request
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const filterRequest = (req, res, done) => {
  const { filterType, pageNo } = req.query;
  Joi.validate({ filterType, pageNo }, filterRequestSchema, (err) => {
    if (!err) return done();
    return res.status(400).json({ status: 'error', code: 400, message: err.details[0].message });
  });
};

export { signup, login, checkRequestId, createRequest, updateRequest, filterRequest };
