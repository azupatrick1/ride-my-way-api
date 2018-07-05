import pool from '../config/pgpool';

const getReqUser = (req, res, next) => {
  const sql = 'SELECT * FROM requests WHERE user_id = $1 AND ride_id = $2';
  pool((err, client, done) => {
    if (err) res.jsend.error({ message: err });

    client.query(sql, [req.currentUser.id, req.ride.id], (error, result) => {
      done();
      if (error) res.jsend.error({ error: error.stack });

      if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
        next();
      } else {
        res.jsend.fail({ message: 'you can not request more than once on a ride ' });
      }
    });
  });
};

export default getReqUser;
