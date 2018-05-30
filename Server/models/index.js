import dotenv from 'dotenv';
import { Client } from 'pg';
import query from './db';

dotenv.config();
const connectionString = process.env.DATABASE_URL;

const client = new Client({
  connectionString,
});

client.connect();
client.query(query, (err) => {
  client.end();
  if (err) { throw err; }
});
