const { ridesDB } = require('../../../index.js');
const { requestDB } = require('../../../index.js');
const joi = require('joi');


const validator = (request) => {
  const schema = {
    sender: joi.string().min(3).required(),
  };
  return joi.validate(request, schema);
};

exports.all = (req, res) => {
  const ride = ridesDB.find(c => c.id === parseInt(req.params.rideId, 10));
  if (!ride) return res.status(404).send({ message: `ride with id ${req.params.rideId} not found` });
  const request = requestDB.find(c => c.rideId === parseInt(ride.id, 10));

  if (!request) {
    return res.status(500).send({
      message: 'no request',
    });
  }
  return res.send(request);
};

exports.create = (req, res) => {
  const ride = ridesDB.find(c => c.id === parseInt(req.params.rideId, 10));
  if (!ride) return res.status(400).send({ message: `ride with id ${req.params.rideId} not found` });

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
