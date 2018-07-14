import pool from '../config/pgpool';

const getRide = (req, res, next) => {
  if (typeof Number(req.params.rideId) !== 'number') {
    res.status(400).jsend.fail({ message: 'wrong format of ride Id supplied at the url ' });
  } else {
    const sql = 'SELECT * FROM rides WHERE id = $1';
    pool((err, client, done) => {
      if (err) res.status(400).jsend.error({ message: 'error connecting to the database' });

      client.query(sql, [Number(req.params.rideId)], (error, result) => {
        done();
        if (error) return res.status(400).jsend.error({ message: 'wrong input parsed as parameter id' });


        if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
          res.status(404).jsend.fail({ message: `rides with id ${req.params.rideId} was not found` });
        } else {
          const ride = result.rows[0];
          req.ride = ride;
          next();
        }
      });
    });
  }
};

export default getRide;
