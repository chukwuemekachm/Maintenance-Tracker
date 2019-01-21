import { Pool } from 'pg';
import url from 'url';

import env from './env';

const parsedUrl = url.parse(env.databaseUrl);

export default new Pool({
  user: parsedUrl.auth.split(':')[0],
  password: parsedUrl.auth.split(':')[1],
  host: parsedUrl.hostname,
  database: parsedUrl.pathname.slice(1), // drop leading slash
  port: Number.parseInt(parsedUrl.port, 10),
  max: 10,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 3000,
});
