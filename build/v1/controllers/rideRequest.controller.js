'use strict';

var _require = require('../../../index.js'),
    ridesDB = _require.ridesDB;

var _require2 = require('../../../index.js'),
    requestDB = _require2.requestDB;

var joi = require('joi');

var validator = function validator(request) {
  var schema = {
    sender: joi.string().min(3).required()
  };
  return joi.validate(request, schema);
};

exports.all = function (req, res) {
  var ride = ridesDB.find(function (c) {
    return c.id === parseInt(req.params.rideId, 10);
  });
  if (!ride) return res.status(404).send({ message: 'ride with id ' + req.params.rideId + ' not found' });
  var request = requestDB.find(function (c) {
    return c.rideId === parseInt(ride.id, 10);
  });

  if (!request) {
    return res.status(500).send({
      message: 'no request'
    });
  }
  return res.send(request);
};

exports.create = function (req, res) {
  var ride = ridesDB.find(function (c) {
    return c.id === parseInt(req.params.rideId, 10);
  });
  if (!ride) return res.status(400).send({ message: 'ride with id ' + req.params.rideId + ' not found' });

  var valid = validator(req.body);
  if (valid.error) return res.status(400).send(valid.error.details[0].message);

  var request = {
    id: requestDB.length + 1,
    rideId: ride.id,
    rideName: ride.name,
    sender: req.body.sender,
    status: 'sent'
  };

  requestDB.push(request);

  return res.status(201).send(request);
};
//# sourceMappingURL=rideRequest.controller.js.map