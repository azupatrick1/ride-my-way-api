import { Client } from 'pg';
import { ridesDB } from '../../../index';

const connectionString = 'postgres://bmeqtfwa:Q_gd2GtV5OQxnlmzHGSq_881mCb6GXSb@tantor.db.elephantsql.com:5432/bmeqtfwa';

const validator = (ride) => {
  const {
    name, from, to, driver, time,
  } = ride;

  let valid = false;
  if (!name) valid = 'name is required!';
  else if (name.length < 3) valid = 'name must be at least 3 letters long!';
  if (!ride) valid = 'ride is required!';
  else if (ride.length < 3) valid = 'ride must be at least 3 letters long!';
  if (!from) valid = 'from is required!';
  else if (from.length < 3) valid = 'from must be at least 3 letters long!';
  if (!to) valid = 'to is required!';
  else if (to.length < 3) valid = 'to must be at least 3 letters long!';
  if (!driver) valid = 'driver is required!';
  else if (driver.length < 3) valid = 'driver must be at least 3 letters long!';
  if (!time) valid = 'time is required!';
  else if (time.length < 3) valid = 'time must be at least 3 letters long!';

  return valid;
};

const getRide = rideId => ridesDB.find(c => c.id === parseInt(rideId, 10));

const rideError = (rideId, res) => res.status(404).send({ message: `ride with id ${rideId} not found` });

exports.all = (req, res) => {
  const client = new Client(connectionString);
  let rides;
  client.connect()
    .then(() => {
      const sql = 'SELECT * FROM rides';
      return client.query(sql);
    }).then((result) => {
      rides = result.rows;
      if (!rides) {
        return res.status(500).send({
          message: 'no rides',
        });
      }
      return res.send(rides);
    });
};

exports.create = (req, res) => {
  const valid = validator(req.body);

  if (valid) return res.status(400).send({ message: valid });

  const ride = {
    id: ridesDB.length + 1,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    driver: req.body.driver,
    time: req.body.time,
  };
  ridesDB.push(ride);

  return res.status(201).send(ride);
};

exports.findOne = (req, res) => {
  const ride = getRide(req.params.rideId);
  if (!ride) return rideError(req.params.rideId, res);

  return res.send(ride);
};

exports.update = (req, res) => {
  const ride = getRide(req.params.rideId);
  if (!ride) return rideError(req.params.rideId, res);

  const valid = validator(req.body);

  if (valid) return res.status(400).send({ message: valid });

  ride.name = req.body.name;
  ride.from = req.body.from;
  ride.to = req.body.to;
  ride.driver = req.body.driver;
  ride.time = req.body.time;
  return res.send(ride);
};

exports.delete = (req, res) => {
  const ride = getRide(req.params.rideId);
  if (!ride) return rideError(req.params.rideId, res);

  const index = ridesDB.indexOf(ride);
  ridesDB.splice(index, 1);

  return res.send({ message: `ride with id ${req.params.rideId} was deleted successfully` });
};

exports.getRide = getRide;
exports.rideError = rideError;
