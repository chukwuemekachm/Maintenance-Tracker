import 'dotenv/config';

import pool from '../config/pool';
import migrate from './migrate';
import seed from './seed';

const migrateDatabase = async () => {
  /* eslint-disable no-console */
  try {
    await migrate(pool);
    await seed(pool);
    console.log('Database migration successful');
    process.exit();
  } catch (err) {
    console.log(err, 'error while running migration');
  }
  /* eslint-enable no-console */
};

migrateDatabase();
