/**
 * @description Builds out an SQL query
 *
 * @param {string} initialQuery The initial SQL query to be extended
 * @param {string} operator The conjuction between the values
 * @param {object} condition The object containing the key value pairs
 *
 * @returns {string}
 */
const queryBuilder = (initialQuery, operator, condition) => {
  let query = initialQuery;
  Object.keys(condition).forEach(key => {
    query +=
      typeof condition[key] === 'string'
        ? `${operator} ${key}='${condition[key]}'`
        : `${operator} ${key}=${condition[key]}`;
  });
  return query;
};

/**
 * @description Builds out an SQL UPDATE query
 *
 * @param {string} initialQuery The initial SQL query to be extended
 * @param {object} condition The object containing the key value pairs
 *
 * @returns {string}
 */
export const updateQueryBuilder = (initialQuery, object) => {
  let query = initialQuery;
  Object.keys(object).forEach(key => {
    query += ` ${key}='${object[key]}',`;
  });
  return `${query.substring(0, query.length - 1)} WHERE 1=1`;
};

export default queryBuilder;
