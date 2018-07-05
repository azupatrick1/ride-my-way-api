import pool from '../config/pgpool';

const getRide = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE id = $1';
  pool((err, client, done) => {
    if (err) res.jsend.error({ message: err });

    client.query(sql, [req.params.rideId], (error, result) => {
      done();
      if (error) res.jsend.error({ message: error.stack });


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
};

export default getRide;
