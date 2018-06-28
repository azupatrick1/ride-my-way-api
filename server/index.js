import express from 'express';
import bodyParser from 'body-parser';

import rideroute from './api/v1/routes/ride.route';
import requestroute from './api/v1/routes/rideRequest.route';

const app = express();
const port = process.env.PORT || 3000;

export const ridesDB = [
  {
    id: 1,
    name: 'ride1234',
    from: 'Abuja',
    to: 'Lagos',
    driver: 'driver 1',
    time: '7:00 pm',
  },
  {
    id: 2,
    name: 'ride1344',
    from: 'Lagos',
    to: 'Aba',
    driver: 'driver 2',
    time: '6:00 am',
  },
];

export const requestDB = [{
  id: 1,
  rideId: 1,
  rideName: 'emeka',
  sender: 'john',
  status: 'sent',
}];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', rideroute);
app.use('/', requestroute);

app.get('/', (req, res) => res.send({ message: 'We are Live!!!' }));
app.get('*', (req, res) => res.status(404).send({ message: 'wrong endpoint: visit api with api/v1/rides' }));

const server = app.listen(port);

export const stop = () => {
  server.close();
};
export default app;

