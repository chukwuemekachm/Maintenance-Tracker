import Repository from './Repository';
import queries from './queries';

const { user: User } = queries;

class UserRepository extends Repository {
  constructor() {
    super();
  }

  /**
   * @description Queries a list of users
   *
   * @param {string} condition The condition to find users
   *
   * @returns {array}
  */
  async get(condition) {
    try {
      const result = await this.queryDb(User.get(condition));
      return result;
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Queries a particular user
   *
   * @param {string} condition The condition to find user
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
   * @description Creates a new user
   *
   * @param {object} user The new user's details
   *
   * @returns {object}
  */
  async save({
    firstname, lastname, email, password,
  }) {
    try {
      const result = await this.queryDb(User.save(), [firstname, lastname, email, password]);
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Updates a user's information
   *
   * @param {object} user The part of the user to be updated
   *
   * @returns {object}
  */
  async update(user, condition) {
    try {
      const result = await this.queryDb(User.update(user, condition));
      return result[0];
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Queries a list of users
   *
   * @param {string} condition The condition to find users
   *
   * @returns {array}
  */
  async delete(condition) {
    try {
      return this.queryDb(User.delete(condition));
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description Queries the existence of a user
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

export default UserRepository;
