// import ridesDB from '../models/ride.model';
import pool from '../config/pgpool';

const getRide = (req, res, next) => {
  const sql = 'SELECT * FROM requests WHERE user_id = $1 AND ride_id = $2';
  pool((err, client, done) => {
    if (err) return res.jsend.error({ err });

    return client.query(sql, [req.currentUser.id, req.ride.id], (error, result) => {
      done();
      if (error) return res.jsend.error({ error: error.stack });

      if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
        return next();
      }
      return res.jsend.fail({ message: 'you can not request more than once on a ride ' });
    });
  });
};

export default getRide;
