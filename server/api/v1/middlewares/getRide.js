// import ridesDB from '../models/ride.model';
import pool from '../config/pgpool';

const getRide = (req, res, next) => {
  // const { rideId } = req.params;
  // const ride = ridesDB.find(c => c.id === parseInt(rideId, 10));

  // if (!ride || ride === undefined || ride === null) {
  //   res.status(404).send({
  //     status: 'fail',
  //     data: { message: `ride with id ${rideId} was not found` },
  //   });
  // } else {
  //   req.ride = ride;
  //   next();
  // }


  const sql = 'SELECT * FROM rides WHERE id = $1';
  pool((err, client, done) => {
    if (err) return res.status(500).send({ status: 'error', error: err });

    return client.query(sql, [req.params.rideId], (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      if (!result || result === undefined || result === null) {
        return res.status(404).send({ status: 'fail', message: `rides with id ${req.params.rideId} was not found` });
      }

      req.ride = result.rows[0];

      return next();
    });
  });
};

export default getRide;
