'use strict';

var _require = require('../../../index.js'),
    ridesDB = _require.ridesDB;

var joi = require('joi');

var validator = function validator(ride) {
  var schema = {
    name: joi.string().min(3).required(),
    from: joi.string().min(3).required(),
    to: joi.string().min(3).required(),
    driver: joi.string().min(3).required(),
    time: joi.string().min(6).required()
  };
  return joi.validate(ride, schema);
};

exports.all = function (req, res) {
  if (!ridesDB) {
    return res.status(500).send({
      message: 'no rides'
    });
  }
  return res.send(ridesDB);
};

exports.create = function (req, res) {
  var valid = validator(req.body);

  if (valid.error) return res.status(400).send(valid.error.details[0].message);

  var ride = {
    id: ridesDB.length + 1,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    driver: req.body.driver,
    time: req.body.time
  };
  ridesDB.push(ride);

  return res.status(201).send(ride);
};

exports.findOne = function (req, res) {
  var ride = ridesDB.find(function (c) {
    return c.id === parseInt(req.params.rideId, 10);
  });
  if (!ride) return res.status(404).send({ message: 'ride with id ' + req.params.rideId + ' not found' });
  return res.send(ride);
};

exports.update = function (req, res) {
  var ride = ridesDB.find(function (c) {
    return c.id === parseInt(req.params.rideId, 10);
  });
  if (!ride) return res.status(404).send({ message: 'ride with id ' + req.params.rideId + ' not found' });

  var valid = validator(req.body);
  if (valid.error) return res.status(400).send(valid.error.details[0].message);

  ride.name = req.body.name;
  ride.from = req.body.from;
  ride.to = req.body.to;
  ride.driver = req.body.driver;
  ride.time = req.body.time;
  return res.send(ride);
};

exports.delete = function (req, res) {
  var ride = ridesDB.find(function (c) {
    return c.id === parseInt(req.params.rideId, 10);
  });
  if (!ride) return res.status(404).send({ message: 'ride with id ' + req.params.rideId + ' not found' });

  var index = ridesDB.indexOf(ride);
  ridesDB.splice(index, 1);

  return res.send({ message: 'ride with id ' + req.params.rideId + ' was deleted successfully' });
};
//# sourceMappingURL=ride.controller.js.map