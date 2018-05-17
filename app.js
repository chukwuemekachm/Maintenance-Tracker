/** imports */
import express from 'express';
import logger from 'morgan';
import errorhandler from 'errorhandler';
import bodyParser from 'body-parser';

/** instantiations */
const app = express();
const port = process.env.PORT || 3000;

/** middlewares */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(errorhandler());

/** route handlers */
app.get('/', (req, res) => res.status(200).json({ message: 'Welcome to Maintenance Tracker' }));

app.all('*', (req, res) => res.status(404).json({ message: 'Route not supported on server.' }));

/** bootups */
app.listen(port, () => console.log(`Server listening on port ${port}...`));

/** export */
export const server = app;
