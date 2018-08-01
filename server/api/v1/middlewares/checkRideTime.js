import pool from '../config/pgpool';

const checkRideTime = (req, res, next) => {
  const sql = 'UPDATE rides SET status = $1 WHERE takeOffDate < NOW()';

  pool((err, client, done) => {
    if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

    client.query(sql, ['completed'], (error) => {
      done();
      if (error) res.status(500).jsend.error({ message: 'could not access request' });
      next();
    });
  });
};

export default checkRideTime;
