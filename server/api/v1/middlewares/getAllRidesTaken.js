import pool from '../config/pgpool';

const getAllRidesTaken = (req, res, next) => {
  const sql = 'SELECT * FROM rides WHERE $1 = ANY(riders)';
  pool((err, client, done) => {
    if (err)
      res
        .status(400)
        .jsend.error({ message: 'error connecting to the database' });

    client.query(sql, [`${req.currentUser.username}`], (error, result) => {
      done();
      if (error)
        return res
          .status(400)
          .jsend.error({ message: 'wrong input parsed as parameter id' });

      if (
        !result.rows ||
        result.rows === null ||
        result.rows === undefined ||
        result.rows.length < 0
      ) {
       
          next();
      } else {
        const ride = result.rows;
        req.ridesTaken = ride;
        next();
      }
    });
  });
};

export default getAllRidesTaken;
