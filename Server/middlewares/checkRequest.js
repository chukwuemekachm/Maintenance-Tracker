import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

/**
   * Checks if the request exists on the system and is still pending
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {object} next - The next middleware
   */
const requestCheckPending = (req, res, next) => {
  const { requestId } = req.params;
  const queryString = {
    text: 'SELECT * FROM requests WHERE id = $1 LIMIT 1;',
    values: [requestId],
  };
  const client = new Client({
    connectionString,
  });
  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (!result.rows[0]) { return res.status(404).json({ status: 'error', code: 404, message: 'Request does not exist' }); }
    const { status } = result.rows[0];
    if (status === 'pending') {
      return next();
    }
    return res.status(400)
      .json({
        status: 'error',
        code: 400,
        message: 'Request can no longer be approved or disapproved',
      });
  });
};

/**
   * Checks if the request exists on the system and is approved
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {object} next - The next middleware
   */
const requestCheckApprove = (req, res, next) => {
  const { requestId } = req.params;
  const queryString = {
    text: 'SELECT * FROM requests WHERE id = $1 LIMIT 1;',
    values: [requestId],
  };
  const client = new Client({
    connectionString,
  });
  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (!result.rows[0]) { return res.status(404).json({ status: 'error', code: 404, message: 'Request does not exist' }); }
    const { status } = result.rows[0];
    if (status === 'approved') {
      return next();
    }
    return res.status(400)
      .json({
        status: 'error',
        code: 400,
        message: 'You can only resolve an approved request',
      });
  });
};

/**
   * Checks if the request exisis for the authenticated user and its still pending
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {object} next - The next middleware
   */
const requestCheckUser = (req, res, next) => {
  const { requestId } = req.params;
  const userId = req.body.token.id;
  const queryString = { text: 'SELECT * FROM requests WHERE id = $1 AND user_id = $2 LIMIT 1;', values: [requestId, userId] };
  const client = new Client({
    connectionString,
  });
  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (!result.rows[0]) { return res.status(404).json({ status: 'error', code: 404, message: 'Request does not exist' }); }
    let { title, type, description } = result.rows[0];
    const { status } = result.rows[0];
    if (status === 'pending') {
      title = req.body.title || title;
      type = req.body.type || type;
      description = req.body.description || description;
      req.body.request = { title, type, description };
      return next();
    }
    return res.status(400).json({ status: 'fail', code: 400, message: 'Request can not be modified' });
  });
};

/**
   * Checks if the request exisis for the authenticated user and is disapproved or resolved
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {object} next - The next middleware
   */
const requestCheckUserDelete = (req, res, next) => {
  const { requestId } = req.params;
  const userId = req.body.token.id;
  const queryString = { text: 'SELECT status FROM requests WHERE id = $1 AND user_id = $2 LIMIT 1;', values: [requestId, userId] };
  const client = new Client({
    connectionString,
  });
  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (!result.rows[0]) { return res.status(404).json({ status: 'fail', code: 404, message: 'Request does not exist' }); }
    const { status } = result.rows[0];
    if (status === 'pending' || status === 'resolved' || status === 'disapproved') {
      return next();
    }
    return res.status(400).json({ status: 'fail', code: 400, message: 'Request can not be deleted, you can not delete an approved request' });
  });
};

/**
   * Checks if the request exists for the authenticated user and is a Duplicate
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {object} next - The next middleware
   */
const requestCheckUserDuplicate = (req, res, next) => {
  const userId = req.body.token.id;
  const { title, type } = req.body.request;
  const queryString = { text: 'SELECT * FROM requests WHERE user_id = $1 AND title = $2 AND type = $3 AND status = $4 LIMIT 1;', values: [userId, title, type, 'pending'] };
  const client = new Client({
    connectionString,
  });
  client.connect();
  client.query(queryString, (error, result) => {
    client.end();
    if (result.rows[0]) { return res.status(409).json({ status: 'fail', code: 409, message: 'Request already exists for user, "No Duplicates"' }); }
    return next();
  });
};

export {
  requestCheckUser,
  requestCheckApprove,
  requestCheckPending,
  requestCheckUserDuplicate,
  requestCheckUserDelete,
};
