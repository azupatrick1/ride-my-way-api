// import ridesDB from '../models/ride.model';
import pool from '../config/pgpool';

const getRide = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE id = $1';
  pool((err, client, done) => {
    if (err) return res.status(500).send({ status: 'error', error: err });

    return client.query(sql, [req.params.rideId], (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      if (!result || result === undefined || result === null) {
        return res.status(404).send({ status: 'fail', message: `rides with id ${req.params.rideId} was not found` });
      }

      req.ride = result.rows[0];

      return next();
    });
  });
};

export default getRide;
