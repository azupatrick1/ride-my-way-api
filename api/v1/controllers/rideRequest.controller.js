import joi from 'joi';
import { requestDB } from '../../../index';
import ridecon from '../controllers/ride.controller';

const { getRide } = ridecon;
const { rideError } = ridecon;

const validator = (request) => {
  const schema = {
    sender: joi.string().min(3).required(),
  };
  return joi.validate(request, schema);
};

exports.all = (req, res) => {
  const ride = getRide(req.params.rideId);
  if (!ride) return rideError(req.params.rideId, res);

  const request = requestDB.find(c => c.rideId === parseInt(ride.id, 10));

  if (!request) {
    return res.status(500).send({
      message: 'no request',
    });
  }
  return res.send(request);
};

exports.create = (req, res) => {
  const ride = getRide(req.params.rideId);
  if (!ride) return rideError(req.params.rideId, res);

  const valid = validator(req.body);
  if (valid.error) return res.status(400).send(valid.error.details[0].message);

  const request = {
    id: requestDB.length + 1,
    rideId: ride.id,
    rideName: ride.name,
    sender: req.body.sender,
    status: 'sent',
  };

  requestDB.push(request);

  return res.status(201).send(request);
};
