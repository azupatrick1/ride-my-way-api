import pool from '../config/pgpool';

const getReqUser = (req, res, next) => {
  const sql = 'SELECT * FROM requests WHERE user_id = $1 AND ride_id = $2';
  pool((err, client, done) => {
    if (err) res.status(500).jsend.error({ message: 'Error connecting to database' });

    client.query(sql, [req.currentUser.id, req.ride.id], (error, result) => {
      done();
      if (error) res.status(404).jsend.error({ error: 'could not get data from data' });

      if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
        next();
      } else {
        res.status(400).jsend.fail({ message: 'you can not request more than once on a ride ' });
      }
    });
  });
};

export default getReqUser;
