
import pool from '../config/pgpool';

class Ride {
  static getAllRide(req, res) {
    const sql = 'SELECT * FROM rides';
    pool((err, client, done) => {
      if (err) res.jsend.error({ error: err });

      client.query(sql, (error, result) => {
        done();
        if (error) res.jsend.error({ error: error.stack });

        if (!result) { res.jsend.fail({ message: 'no rides in the database' }); } else {
          res.jsend.success({ rides: result.rows });
        }
      });
    });
  }


  static createRide(req, res) {
    const data = [req.body.name.trim(), req.body.location.trim(), req.body.destination.trim(),
      req.body.slot, req.body.time, req.currentUser.id];

    const sql = 'INSERT INTO rides(name, location, destination, slot, time, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';


    pool((err, client, done) => {
      if (err) res.jsend.error({ message: err });

      return client.query(sql, data, (error, ride) => {
        done();
        if (error) res.jsend.error({ message: error.stack });

        res.jsend.success({ ride: ride.rows[0] });
      });
    });
  }

  static findOneRide(req, res) {
    const { ride } = req;
    res.jsend.success({ ride });
  }

  static deleteRide(req, res) {
    const sql = 'UPDATE rides SET status = $1 WHERE id = $2';
    if (req.currentUser.id !== req.ride.user_id) res.jsend.fail({ message: 'you can not cancel someone else ride' });

    pool((err, client, done) => {
      if (err) res.jsend.error({ message: 'error connecting to database' });

      client.query(sql, ['cancelled', req.params.rideId], (error) => {
        done();
        if (error) res.jsend.error({ message: 'error while trying to cancel ride' });

        res.jsend.success({ message: 'The ride has been cancelled' });
      });
    });
  }
}
export default Ride;
