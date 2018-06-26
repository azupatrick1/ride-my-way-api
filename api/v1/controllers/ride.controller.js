import joi from 'joi';
import { ridesDB } from '../../../index';


const validator = (ride) => {
  const schema = {
    name: joi.string().min(3).required(),
    from: joi.string().min(3).required(),
    to: joi.string().min(3).required(),
    driver: joi.string().min(3).required(),
    time: joi.string().min(6).required(),
  };
  return joi.validate(ride, schema);
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

  if (valid.error) return res.status(400).send(valid.error.details[0].message);

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
  if (valid.error) return res.status(400).send(valid.error.details[0].message);

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
