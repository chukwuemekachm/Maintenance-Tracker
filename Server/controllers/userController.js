import Request from '../models/request';

class UserController {
  /**
     * Gets request of a user
     *
     * @param {object} req - The request object received
     * @param {object} res - The response object sent
     *
     * @returns {object}
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
}

export default UserController;
