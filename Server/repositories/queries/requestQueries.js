import queryBuilder, { updateQueryBuilder } from '../../helpers/queryBuilder';

export default {
  get: (condition) => {
    const initial = 'SELECT * FROM requests WHERE 1=1';
    return `${queryBuilder(initial, 'AND', condition)} ORDER BY id DESC;`;
  },
  delete: (condition) => {
    const initial = 'DELETE FROM requests WHERE 1=1';
    return queryBuilder(initial, ' AND', condition);
  },
  update: (object, condition) => {
    const initial = 'UPDATE requests SET ';
    return `${queryBuilder(updateQueryBuilder(initial, object), ' AND', condition)} RETURNING *;`;
  },
  save: () =>
    `INSERT INTO requests(title, type, description, user_id, status)
      VALUES($1, $2, $3, $4, $5)
      RETURNING id, title, type, description, user_id, status, createdat`,
};
