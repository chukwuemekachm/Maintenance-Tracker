import env from '../config/env';

const { isProduction } = env;

export const SUCCESS = 'success';
export const FAIL = 'fail';
export const ERROR = 'error';

/**
 * @description Sends a response to the user
 *
 * @param {object} res The HTTP response object
 * @param {string} status The status of the request
 * @param {number} code The HTTP status code of the response
 * @param {string} res The message of the response
 *
 * @returns {object}
 */
const sendResponse = (res, status, code, data, message) =>
  res.status(code).json({
    status,
    code,
    data,
    message,
  });

/**
 * @description Sends an internal server error to the user
 *
 * @param {object} res The HTTP response object
 * @param {string} error The error/exception which occurred on the server
 *
 * @returns {object}
 */
export const sendServerErrorResponse = (res, error) =>
  res.status(500).json({
    status: FAIL,
    code: 500,
    data: isProduction ? 'An error occurred on our servers' : error,
    message: 'Internal server error',
  });

export default sendResponse;
