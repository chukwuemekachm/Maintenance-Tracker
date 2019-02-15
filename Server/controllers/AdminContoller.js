import sendResponse, {
  sendServerErrorResponse,
  FAIL,
  ERROR,
  SUCCESS,
} from '../helpers/sendResponse';
import RequestRepository from '../repositories/RequestRepository';
import EmailSender from '../extensions/emailSender';

class AdminController {
  constructor() {
    this.requestRepo = new RequestRepository();
  }

  /**
   * @description Returns all requests on the platform
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  getRequests = async (req, res) => {
    try {
      const { filterType, pageNo } = req.query;
      const offSet = pageNo ? (parseInt(pageNo, 10) - 1) * 12 : 0;
      const queryString = AdminController.buildFilterQuery(filterType);
      const queryParams = [offSet];
      const requests = await this.requestRepo.queryDb(queryString, queryParams);
      return sendResponse(
        res,
        SUCCESS,
        200,
        requests,
        'Requests retrieved successfully',
      );
    } catch (err) {
      return sendServerErrorResponse(res, err);
    }
  };

  /**
   * @description Modifies the status of a request in the database
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   * @param {string} status - The status of the request
   *
   * @returns {object}
   */
  updateRequestStatus = async (req, res, status) => {
    try {
      const { requestId } = req.params;
      EmailSender.sendUserRequestStatus(requestId);
      const request = await this.requestRepo.update(
        { status },
        { id: requestId },
      );
      return sendResponse(
        res,
        SUCCESS,
        200,
        request,
        `Request ${status} successfully`,
      );
    } catch (error) {
      return sendServerErrorResponse(res, err);
    }
  };

  /**
   * @description Modifies the status of a request to approve
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  approveRequest = async (req, res) =>
    this.updateRequestStatus(req, res, 'approved');

  /**
   * @description Modifies the status of a request to disapprove
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  disapproveRequest = async (req, res) =>
    this.updateRequestStatus(req, res, 'disapproved');

  /**
   * @description Modifies the status of a request to resolve
   *
   * @param {object} req - The request object received
   * @param {object} res - The response object sent
   *
   * @returns {object}
   */
  resolveRequest = async (req, res) =>
    this.updateRequestStatus(req, res, 'resolved');

  /**
   * Builds a query string for the get Request route by the filter type
   *
   * @param {String} filterType - The filter Type to be used
   */
  static buildFilterQuery = filterType => {
    let queryString;
    switch (filterType) {
      case 'approve':
      case 'approved':
        queryString =
          "SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.title, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id WHERE requests.status = 'approved' ORDER BY request_id DESC LIMIT 12 OFFSET $1;";
        break;
      case 'resolve':
      case 'resolved':
        queryString =
          "SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.title, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id WHERE requests.status = 'resolved' ORDER BY request_id DESC LIMIT 12 OFFSET $1;";
        break;
      case 'pending':
        queryString =
          "SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.title, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id WHERE requests.status = 'pending' ORDER BY request_id DESC LIMIT 12 OFFSET $1";
        break;
      case 'repair':
        queryString =
          "SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.title, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id WHERE requests.type = 'repair' ORDER BY request_id DESC LIMIT 12 OFFSET $1";
        break;
      case 'maintenance':
        queryString =
          "SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.title, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id WHERE requests.type = 'maintenance' ORDER BY request_id DESC LIMIT 12 OFFSET $1";
        break;
      default:
        queryString =
          'SELECT requests.id AS request_id, users.firstname, users.lastname, users.email, requests.title, requests.type, requests.description, requests.status, requests.createdat, requests.updatedat FROM requests INNER JOIN users ON requests.user_id = users.id ORDER BY request_id DESC LIMIT 12 OFFSET $1';
        break;
    }
    return queryString;
  };
}

export default new AdminController();
