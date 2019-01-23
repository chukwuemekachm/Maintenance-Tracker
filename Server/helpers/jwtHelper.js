import jwt from 'jsonwebtoken';

const { JWT_KEY } = process.env;

/**
 * @description Generates a JWT token
 *
 * @param {object} payload The payload to be signed into the token
 * @param {string} expiresIn The expiration tme of the token
 *
 * @returns {string}
 */
export const generateToken = (payload, expiresIn) =>
  jwt.sign(payload, JWT_KEY, { expiresIn });

/**
 * @description Decodes a JWT token
 *
 * @param {string} token The JWT token to be decoded
 *
 * @returns {string}
 */
export const decodeToken = token => {
  try {
    const decoded = jwt.verify(token, JWT_KEY);
    return decoded;
  } catch (err) {
    return false;
  }
};
