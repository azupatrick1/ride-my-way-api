import pool from '../config/pgpool';

const getRequestRecieve = (req, res, next) => {
  const sql = 'SELECT * FROM requests WHERE driver_id = $1';
  pool((err, client, done) => {
    if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

    client.query(sql, [req.currentUser.id], (error, result) => {
      done();
      if (error) return res.status(400).jsend.error({ message: error });

      if (!result.rows || result.rows === null || result.rows === undefined
        || result.rows.length < 0) {
        next();
      } else {
        const request = result.rows;
        req.requestRecieve = request;

        next();
      }
    });
  });
};

export default getRequestRecieve;
