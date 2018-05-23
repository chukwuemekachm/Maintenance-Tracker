import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const superUserPassword = bcrypt.hashSync(process.env.JWT_KEY, 10);
const regularUserPassword = bcrypt.hashSync(process.env.USER_PASSWORD, 10);
const migrateUserDb = 'DROP TABLE IF EXISTS users CASCADE; CREATE TABLE users (id SERIAL NOT NULL PRIMARY KEY, firstname VARCHAR(20) NOT NULL, lastname VARCHAR(20) NOT NULL, email VARCHAR(20) NOT NULL UNIQUE, admin BOOLEAN NOT NULL DEFAULT FALSE, password VARCHAR(255) NOT NULL, createdat TIMESTAMP NOT NULL DEFAULT NOW(), updatedat TIMESTAMP NOT NULL DEFAULT NOW() );';
const seedSuperUser = `INSERT INTO users (firstname,lastname,email,admin,password) VALUES ('Chima','Emeka','emecus10@gmail.com',true,'${superUserPassword}');`;
const seedRegularUser = `INSERT INTO users (firstname,lastname,email,admin,password) VALUES ('Bright','Chiemela','brighto@gmail.com',false,'${regularUserPassword}');`;
const migrateRequestDb = 'DROP TABLE IF EXISTS requests CASCADE; CREATE TABLE requests (id SERIAL NOT NULL PRIMARY KEY, title VARCHAR(50) NOT NULL, type VARCHAR(10) NOT NULL, description VARCHAR(255) NOT NULL, user_id int NOT NULL, status VARCHAR(20) NOT NULL DEFAULT \'pending\', createdat TIMESTAMP NOT NULL DEFAULT NOW(), updatedat TIMESTAMP NOT NULL DEFAULT NOW(), FOREIGN KEY (user_id) REFERENCES "users" (id) ON UPDATE CASCADE ON DELETE CASCADE );';
const seedSuperUserRequests = 'INSERT INTO requests (title,type,description,user_id,status) VALUES (\'My Television\',\'repair\',\'My Television displays black and white and cant dispaly colors\',1,\'pending\'); INSERT INTO requests (title,type,description,user_id,status) VALUES (\'Bad Air Conditioner\',\'repair\',\'The air conditioner makes noise and doesnt cool\',1,\'pending\');';
const query = `${migrateUserDb} ${seedSuperUser} ${seedRegularUser} ${migrateRequestDb} ${seedSuperUserRequests}`;

export default query;
