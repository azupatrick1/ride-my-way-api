import express from 'express';
import bodyParser from 'body-parser';

import rideroute from './api/v1/routes/ride.route';
import requestroute from './api/v1/routes/rideRequest.route';
import authroute from './api/v1/routes/auth.route';

process.env.NODE_ENV = 'development';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', authroute);
app.use('/', rideroute);
app.use('/', requestroute);

app.get('/', (req, res) => res.send({ status: 'success', message: 'We are Live!!!' }));
app.get('*', (req, res) => res.status(404).send({ status: 'fail', message: 'wrong endpoint: visit api with api/v1/rides' }));
app.post('*', (req, res) => res.status(404).send({ status: 'fail', message: 'wrong endpoint: visit api with api/v1/rides' }));
app.put('*', (req, res) => res.status(404).send({ status: 'fail', message: 'wrong endpoint: visit api with api/v1/rides' }));
app.delete('*', (req, res) => res.status(404).send({ status: 'fail', message: 'wrong endpoint: visit api with api/v1/rides' }));

const server = app.listen(port);

export const stop = () => {
  server.close();
};
export default app;

