import db from './index';

class Request {
  /**
     * Represents a Request
     * @param {number} id - The id of the request
     * @param {string} title - The title of the request
     * @param {string} type - The type of the request
     * @param {string} description - The description of the request
     */
  constructor(id, title, type, description) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.description = description;
    this.createdAt = new Date().toLocaleTimeString();
    this.updatedAt = new Date().toLocaleTimeString();
  }

  /**
     * Returns all requests
     * @access static
     */
  static getRequest() {
    return db.requests;
  }

  /**
     * Returns a single request
     * @param {number} id - The id of request to be found
     * @access static
     */
  static getRequestById(id) {
    return db.requests.find(x => x.id === parseInt(id, 10));
  }

  /**
     * Creates a new request
     * @param {object} request - The new request to be added
     * @access static
     */
  static createRequest(request) {
    db.requests.push(request);
    return true;
  }

  /**
     * Returns a single request
     * @param {number} id - The id of request to be found
     * @param {object} request - The new request to be updated
     * @access static
     */
  static updateRequest(id, request) {
    db.requests.splice(id, 1, request);
    return true;
  }

  /**
     * Returns the number of requests in memory
     */
  static count() {
    return db.requests.length;
  }
}

export default Request;
