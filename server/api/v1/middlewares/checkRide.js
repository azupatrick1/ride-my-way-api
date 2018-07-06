import pool from '../config/pgpool';

const checkRide = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE status = $1 AND user_id = $2';
  pool((err, client, done) => {
    if (err) res.jsend.error({ message: err });

    client.query(sql, ['pending', req.currentUser.id], (error, result) => {
      done();
      if (error) res.jsend.error({ message: error.stack });


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
