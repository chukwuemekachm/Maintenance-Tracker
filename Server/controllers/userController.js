import Request from '../models/request';

class UserController {
  /**
     * Gets requests of a user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {array}
     */
  getRequest(req, res) {
    const requests = Request.getRequest();
    res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Requests found for the user',
      data: { requests },
    });
  }

  /**
     * Gets a single request of a user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  getRequestById(req, res) {
    if (!req.params.id || isNaN(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Request id not valid',
      });
    }
    const request = Request.getRequestById(req.params.id);
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'No request found for the user',
      });
    }
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Request found for the user',
      data: { request },
    });
  }

  /**
     * Creates a new request
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  createRequest(req, res) {
    const request = new Request(
      Request.count(),
      req.body.request.title,
      req.body.request.type,
      req.body.request.description,
    );
    Request.createRequest(request);
    return res.status(201).json({
      status: 'success',
      code: 201,
      message: 'Request created successfully',
      data: { request },
    });
  }

  /**
     * Updates an existing request when it exists
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
     */
  updateRequest(req, res) {
    if (!req.params.id || isNaN(req.params.id)) {
      return res.status(400).json({
        status: 'error',
        code: 400,
        message: 'Request id not valid',
      });
    }
    const request = Request.getRequestById(parseInt(req.params.id, 10));
    if (!request) {
      return res.status(404).json({
        status: 'fail',
        code: 404,
        message: 'Request not found',
      });
    }
    request.title = req.body.title || request.title;
    request.type = req.body.type || request.type;
    request.description = req.body.description || request.description;
    request.updatedAt = new Date().toLocaleTimeString();
    Request.updateRequest(parseInt(req.params.id, 10), request);
    return res.status(200).json({
      status: 'success',
      code: 200,
      message: 'Request updated successfully',
      data: { request },
    });
  }
}

export default UserController;
