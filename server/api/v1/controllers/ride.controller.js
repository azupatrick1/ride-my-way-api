import ridesDB from '../models/ride.model';
import pool from '../config/pgpool';


export function all(req, res) {
  // if (!ridesDB || ridesDB === null || ridesDB === undefined) {
  //   return res.status(500).send({
  //     status: 'error',
  //     message: 'there was a problem retrieving rides from server',
  //   });
  // }
  // return res.send({
  //   status: 'success',
  //   data: { rides: ridesDB },
  // });

  const sql = 'SELECT * FROM rides';
  pool((err, client, done) => {
    if (err) return res.status(500).send({ status: 'error', error: err });

    return client.query(sql, (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      if (!result) return res.status(404).send({ status: 'fail', message: 'no rides in the database' });

      return res.status(200).send({
        status: 'success',
        data: { rides: result.rows },
      });
    });
  });
}


export function create(req, res) {
  const data = [req.body.name, req.body.location, req.body.destination,
    req.body.slot, req.body.time, req.decoded.id];

  const sql = 'INSERT INTO rides(name, location, destination, slot, time, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';


  pool((err, client, done) => {
    if (err) return res.status(500).send({ error: err });

    return client.query(sql, data, (error, ride) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      return res.status(201).send({
        status: 'success',
        data: { ride: ride.rows[0] },
      });
    });
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
