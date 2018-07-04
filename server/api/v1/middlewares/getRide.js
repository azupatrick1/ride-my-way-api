// import ridesDB from '../models/ride.model';
import pool from '../config/pgpool';

const getRide = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE id = $1';
  pool((err, client, done) => {
    if (err) return res.jsend.error({ err });

    return client.query(sql, [req.params.rideId], (error, result) => {
      done();
      if (error) return res.jsend.error({ error: error.stack });


      if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
        return res.jsend.fail({ message: `rides with id ${req.params.rideId} was not found` });
      }
      req.ride = result.rows[0];


      next();
    });
  });
};

export default getRide;
