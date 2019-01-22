import queryBuilder, { updateQueryBuilder } from '../../helpers/queryBuilder';

export default {
  get: (condition) => {
    const initial = 'SELECT * FROM users WHERE 1=1';
    return queryBuilder(initial, ' AND', condition);
  },
  delete: (condition) => {
    const initial = 'DELETE FROM users WHERE 1=1';
    return queryBuilder(initial, ' AND', condition);
  },
  update: (object, condition) => {
    const initial = 'UPDATE users SET';
    return `${queryBuilder(updateQueryBuilder(initial, object), ' AND', condition)}  RETURNING *;`;
  },
  save: () =>
    `INSERT INTO users(firstname, lastname, email, password)
      VALUES($1, $2, $3, $4)
      RETURNING id, firstname, lastname, email, admin, createdat;`,
};
