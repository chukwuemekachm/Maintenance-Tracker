const createUserTable = `
  DROP TABLE IF EXISTS users CASCADE;
  CREATE TABLE users
    (
      id SERIAL NOT NULL PRIMARY KEY,
      firstname VARCHAR(30) NOT NULL,
      lastname VARCHAR(30) NOT NULL,
      email VARCHAR(50) NOT NULL UNIQUE,
      admin BOOLEAN NOT NULL DEFAULT FALSE,
      password VARCHAR(255) NOT NULL,
      createdat TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMP NOT NULL DEFAULT NOW()
    );
`;

const createRequestTable = `
  DROP TABLE IF EXISTS requests CASCADE;
  CREATE TABLE requests
    (
      id SERIAL NOT NULL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(30) NOT NULL,
      description VARCHAR(255) NOT NULL,
      user_id int NOT NULL,
      status VARCHAR(30) NOT NULL DEFAULT 'pending',
      createdat TIMESTAMP NOT NULL DEFAULT NOW(),
      updatedat TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE
    );
`;

const migrate = async (pool) => {
  try {
    await pool.query(createUserTable);
    await pool.query(createRequestTable);
    return true;
  } catch (err) {
    throw err;
  }
};

export default migrate;
