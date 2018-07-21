import pool from '../config/pgpool';

const getAllRidesGiven = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE User_id = $1';
  pool((err, client, done) => {
    if (err) res.status(400).jsend.error({ message: 'error connecting to the database' });

    client.query(sql, [req.currentUser.id], (error, result) => {
      done();
      if (error) return res.status(400).jsend.error({ message: 'wrong input parsed as parameter id' });

      if ( !result.rows ||
        result.rows === null ||
        result.rows === undefined ||
        result.rows.length < 0
      ) {
       
          next();
      } else {
        const ride = result.rows;
        req.ridesGiven = ride;
        next();
      }
    });
  });
};

export default getAllRidesGiven;
