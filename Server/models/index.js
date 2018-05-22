import dotenv from 'dotenv';
import { Client } from 'pg';
import winston from 'winston';
import query from './db';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

client.connect();
client.query(query, (err, res) => {
  winston.log(err ? err.stack : res);
  client.end();
});
