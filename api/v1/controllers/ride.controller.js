import { ridesDB } from '../../../index';


const validator = (ride) => {
  const { name } = ride;
  const { from } = ride;
  const { to } = ride;
  const { driver } = ride;
  const { time } = ride;

  if (!name) return 'name is required!';
  else if (name.length < 3) return 'name must be at least 3 letters long!';
  if (!ride) return 'ride is required!';
  else if (ride.length < 3) return 'ride must be at least 3 letters long!';
  if (!from) return 'from is required!';
  else if (from.length < 3) return 'from must be at least 3 letters long!';
  if (!to) return 'to is required!';
  else if (to.length < 3) return 'to must be at least 3 letters long!';
  if (!driver) return 'driver is required!';
  else if (driver.length < 3) return 'driver must be at least 3 letters long!';
  if (!time) return 'time is required!';
  else if (time.length < 3) return 'time must be at least 3 letters long!';

  return false;
};

const getRide = rideId => ridesDB.find(c => c.id === parseInt(rideId, 10));

const rideError = (rideId, res) => res.status(404).send({ message: `ride with id ${rideId} not found` });

exports.all = (req, res) => {
  if (!ridesDB) {
    return res.status(500).send({
      message: 'no rides',
    });
  }
  return res.send(ridesDB);
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
