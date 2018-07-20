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
        !result.rows[0] ||
        result.rows[0] === null ||
        result.rows[0] === undefined ||
        result.rows[0].length < 0
      ) {
       
          next();
      } else {
        const ride = result.rows[0];
        req.ridesTaken = ride;
        next();
      }
    });
  });
};

export default getAllRidesTaken;
