import Joi from 'joi';

const createRequestSchema = Joi.object().keys({
  title: Joi.string().required(),
  type: Joi.string().required(),
  description: Joi.string().required(),
});

/**
 * Validates user inputs in request payload
 *
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {object} done - The next middleware to be called
 */
const createRequest = (req, res, done) => {
  if (!req.body.title || typeof req.body.title !== 'string' || !/^[a-zA-Z0-9\s\,\.]{1,}$/.test(req.body.title)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'title is required or invalid',
    });
  }
  if (!req.body.type || typeof req.body.type !== 'string' || !/^[a-zA-Z0-9]{1,}$/.test(req.body.type)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'type is required or invalid',
    });
  }
  if (!req.body.description || typeof req.body.description !== 'string' || !/^[a-zA-Z0-9\s\,\.]{1,}$/.test(req.body.description)) {
    return res.status(400).json({
      status: 'error',
      code: 400,
      message: 'description is required or invalid',
    });
  }

  const request = {
    title: req.body.title.replace(/  +/g, ' ').trim(),
    type: req.body.type.replace(/  +/g, '').trim(),
    description: req.body.description.replace(/  +/g, ' ').trim(),
  };

  Joi.validate(request, createRequestSchema, (err) => {
    if (err) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: err.details[0].message,
      });
    }
    req.body.request = request;
    return true;
  });
  return done();
};

export default createRequest;
