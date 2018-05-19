import Request from '../models/request';

class UserController {
  /**
     * Gets request of a user
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
     * Gets request of a user
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
}

export default UserController;
