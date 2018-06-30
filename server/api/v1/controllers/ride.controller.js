import ridesDB from '../models/ride.model';

export function all(req, res) {
  if (!ridesDB || ridesDB === null || ridesDB === undefined) {
    return res.status(500).send({
      status: 'error',
      message: 'there was a problem retrieving rides from server',
    });
  }
  return res.send({
    status: 'success',
    data: { rides: ridesDB },
  });
}

export function create(req, res) {
  const ride = {
    id: ridesDB.length + 1,
    name: req.body.name,
    from: req.body.from,
    to: req.body.to,
    driver: req.body.driver,
    time: req.body.time,
  };
  ridesDB.push(ride);
  return res.status(201).send({
    status: 'success',
    data: { ride },
  });
}

export function findOne(req, res) {
  const { ride } = req;
  return res.send({
    status: 'success',
    data: { ride },
  });
}

export function update(req, res) {
  const { ride } = req;
  ride.name = req.body.name;
  ride.from = req.body.from;
  ride.to = req.body.to;
  ride.driver = req.body.driver;
  ride.time = req.body.time;
  return res.send({
    status: 'success',
    data: { ride },
  });
}

export const deleteRide = (req, res) => {
  const { ride } = req;
  const index = ridesDB.indexOf(ride);
  ridesDB.splice(index, 1);
  return res.send({
    status: 'success',
    data: null,
  });
};
