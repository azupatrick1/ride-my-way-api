const { ridesDB } = require('../../../index.js');
const joi = require('joi');


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

