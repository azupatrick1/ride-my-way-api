import express from 'express';
import bodyParser from 'body-parser';
import jsend from 'jsend';
import cors from 'cors';
import morgan from 'morgan';
import createLogger from 'logging';

import rideroute from './api/v1/routes/ride';
import requestroute from './api/v1/routes/rideRequest';
import authroute from './api/v1/routes/auth';

const app = express();
const port = process.env.PORT || 3000;
const logger = createLogger('RideMyWay');

const corsOptions = {
  optionSuccessStatus: 200,
};
app.options('*', cors(corsOptions));
app.use('*', cors(corsOptions));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(jsend.middleware);
app.use('/', authroute);
app.use('/', rideroute);
app.use('/', requestroute);

app.get('/', (req, res) => res.jsend.success({ message: 'We are Live!!!' }));
app.all('*', (req, res) => res.status(404).jsend.fail({ message: 'wrong endpoint: visit api with api/v1/rides' }));


const server = app.listen(port, () => {
  logger.info(`app listening on port ${port} ...`);
});

export const stop = () => {
  server.close();
};
export default app;

