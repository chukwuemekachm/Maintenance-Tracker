import pool from '../config/pool';

class Repository {
  constructor() {
    this.pool = pool;
  }

  /**
   * @description Queries the database
   *
   * @param {string} query The SQL query to be run
   * @param {array} params The SQL parameters to be used in the query
   *
   * @returns {array}
  */
  async queryDb(query, params = []) {
    try {
      const result = await pool.query(query, params);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }
}

export default Repository;
