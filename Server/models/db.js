const migrateUserDb = 'DROP TABLE IF EXISTS users CASCADE; CREATE TABLE users (id SERIAL NOT NULL PRIMARY KEY, firstname VARCHAR(20) NOT NULL, lastname VARCHAR(20) NOT NULL, email VARCHAR(20) NOT NULL UNIQUE, admin BOOLEAN NOT NULL DEFAULT FALSE, password VARCHAR(100) NOT NULL, createdat TIMESTAMP NOT NULL DEFAULT CURRENT_DATE, updatedat TIMESTAMP NOT NULL DEFAULT CURRENT_DATE );';
const seedSuperUser = 'INSERT INTO users (firstname,lastname,email,admin,password) VALUES (\'Chima\',\'Emeka\',\'emecus10@gmail.com\',true,\'123456\');';
const query = `${migrateUserDb} ${seedSuperUser}`;

export default query;
