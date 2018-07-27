
import pool from '../config/pgpool';

class Ride {
  static getAllRide(req, res) {
    const sql = 'SELECT * FROM rides';
    pool((err, client, done) => {
      if (err) res.status(500).jsend.error({ error: 'internal server error' });

      client.query(sql, (error, result) => {
        done();
        if (error) return res.status(400).jsend.error({ error: 'could not get response from database' });

        if (!result) { res.status(404).jsend.fail({ message: 'no rides in the database' }); } else {
          res.jsend.success({ rides: result.rows });
        }
      });
    });
  }


  static createRide(req, res) {
    const data = [req.body.name, req.body.location, req.body.destination,
      Number(req.body.slot), req.body.time, req.currentUser.id,
      req.currentUser.username, req.body.carModel, req.body.takeOffDate];
    if (req.checkRide) {
      res.jsend.fail({ message: 'you are denied: you still have a pending ride' });
    } else {
      const sql = 'INSERT INTO rides(name, location, destination, slot, time, user_id, driver, carModel, takeOffDate) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *';

      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        return client.query(sql, data, (error, ride) => {
          done();
          if (error) res.status(400).jsend.error({ message: 'error creating ride' });

          res.jsend.success({ ride: ride.rows[0] });
        });
      });
    }
  }


  static findOneRide(req, res) {
    const { ride } = req;
    res.jsend.success({ ride });
  }

  static editRide(req, res) {
    const data = [req.body.name, req.body.location, req.body.destination,
      Number(req.body.slot), req.body.time, req.body.carModel, req.body.takeOffDate, req.ride.id];

    const sql = 'UPDATE rides SET name = $1, location = $2, destination = $3, slot= $4, time = $5, carModel = $6, takeOffDate = $7, updated_at = NOW() WHERE id = $8 RETURNING *';
    if (req.currentUser.id !== req.ride.user_id) {
      res.status(403).jsend.fail({ message: 'you can not update someone else ride' });
    } else if (req.ride.status === 'cancelled') {
      res.status(400).jsend.fail({ message: 'ride is already cancelled' });
    } else if (req.ride.status === 'completed') {
      res.status(400).jsend.fail({ message: 'ride is already completed' });
    } else {
      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        return client.query(sql, data, (error, ride) => {
          done();
          if (error) res.status(400).jsend.error({ message: 'error updating ride' });

          res.jsend.success({ ride: ride.rows[0] });
        });
      });
    }
  }
  static deleteRide(req, res) {
    const sql = 'UPDATE rides SET status = $1 WHERE id = $2';

    const alterRequest = (status) => {
      const sql2 = 'UPDATE requests SET status = $1 WHERE ride_id = $2';

      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sql2, [status, req.ride.id], (error) => {
          done();
          if (error) res.status(500).jsend.error({ message: 'could not access request' });
        });
      });
    };

    if (req.currentUser.id !== req.ride.user_id) {
      res.status(403).jsend.fail({ message: 'you can not cancel someone else ride' });
    } else if (req.ride.status === 'cancelled') {
      res.status(400).jsend.fail({ message: 'ride is already cancelled' });
    } else {
      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sql, ['cancelled', req.params.rideId], (error) => {
          done();
          if (error) res.status(400).jsend.error({ message: 'error while trying to cancel ride' });
          alterRequest('Ride has been cancelled');
          res.jsend.success({ message: 'The ride has been cancelled' });
        });
      });
    }
  }
}
export default Ride;
