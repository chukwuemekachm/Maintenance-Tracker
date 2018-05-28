import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const secret = process.env.JWT_KEY;

/**
 * Validates admin authorization token
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const authenticateAdmin = (req, res, next) => {
  let decoded = '';
  try {
    const token = req.headers.authorization.split(' ')[1] || req.body.token || req.headers.token;
    decoded = jwt.verify(token, secret);
    req.body.token = decoded;
  } catch (error) {
    return res.status(401)
      .json({
        status: 'fail',
        code: 401,
        message: 'Invalid authorization token',
      });
  }
  if (decoded.admin) {
    return next();
  }
  return res.status(403)
    .json({
      status: 'fail',
      code: 403,
      message: 'You dont have access to this resource',
    });
};

export default authenticateAdmin;
