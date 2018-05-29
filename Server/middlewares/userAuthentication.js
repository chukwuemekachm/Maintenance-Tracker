import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret = process.env.JWT_KEY;

/**
 * Validates user authorization token
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const authenticateUser = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1] || req.body.token || req.headers.token;
    const decoded = jwt.verify(token, secret);
    req.body.token = decoded;
  } catch (error) {
    return res.status(401)
      .json({
        status: 'fail',
        code: 401,
        message: 'Invalid authorization token',
      });
  }
  return next();
};

export default authenticateUser;
