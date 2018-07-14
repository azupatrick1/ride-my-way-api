import pool from '../config/pgpool';

const checkRide = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE status = $1 AND user_id = $2';
  pool((err, client, done) => {
    if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

    client.query(sql, ['pending', req.currentUser.id], (error, result) => {
      done();
      if (error) res.status(500).jsend.error({ message: 'error  fetching data from database' });


      if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
        req.checkRide = false;
        next();
      } else {
        req.checkRide = true;
        next();
      }
    });
  });
};

export default checkRide;
