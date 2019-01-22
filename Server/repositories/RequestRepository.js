import Repository from './Repository';
import queries from './queries';

const { request: Request } = queries;

class RequestRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * @description Queries a list of requests
   *
   * @param {string} condition The condition to find requests
   *
   * @returns {array}
  */
  async get(condition) {
    try {
      const result = await this.queryDb(Request.get(condition));
      return result;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Queries a particular request
   *
   * @param {string} condition The condition to find request
   *
   * @returns {object}
  */
  async getOne(condition) {
    try {
      const result = await this.get(condition);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Creates a new request
   *
   * @param {object} user The new request's details
   *
   * @returns {object}
  */
  async save({
    title, type, description, userId,
  }) {
    try {
      const result = await this.queryDb(Request.save(), [title, type, description, userId, 'pending']);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Updates a request's information
   *
   * @param {object} user The part of the request to be updated
   *
   * @returns {object}
  */
  async update(request, condition) {
    try {
      const result = await this.queryDb(Request.update(request, condition));
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Queries a list of requests
   *
   * @param {string} condition The condition to find requests
   *
   * @returns {array}
  */
  async delete(condition) {
    try {
      return this.queryDb(Request.delete(condition));
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Queries the existence of a request
   *
   * @param {string} condition The condition to find requests
   *
   * @returns {array}
  */
  async exists(condition) {
    try {
      const result = await this.getOne(condition);
      if (result) return true;
      return false;
    } catch (err) {
      throw err;
    }
  }
}

export default RequestRepository;
