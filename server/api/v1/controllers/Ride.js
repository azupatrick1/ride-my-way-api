import ridesDB from '../models/ride';
import pool from '../config/pgpool';

class Ride {
  static all(req, res) {
    const sql = 'SELECT * FROM rides';
    pool((err, client, done) => {
      if (err) return res.jsend.error({ error: err });

      return client.query(sql, (error, result) => {
        done();
        if (error) return res.jsend.error({ error: error.stack });

        if (!result) return res.jsend.fail({ message: 'no rides in the database' });

        return res.jsend.success({ rides: result.rows });
      });
    });
  }


  static create(req, res) {
    const data = [req.body.name, req.body.location, req.body.destination,
      req.body.slot, req.body.time, req.currentUser.id];

    const sql = 'INSERT INTO rides(name, location, destination, slot, time, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *';


    pool((err, client, done) => {
      if (err) return res.jsend.error({ error: err });

      return client.query(sql, data, (error, ride) => {
        done();
        if (error) return res.jsend.error({ error: error.stack });

        return res.jsend.success({ ride: ride.rows[0] });
      });
    });
  }

  static findOne(req, res) {
    const { ride } = req;
    return res.jsend.success({ ride });
  }

  static update(req, res) {
    const { ride } = req;
    ride.name = req.body.name;
    ride.from = req.body.from;
    ride.to = req.body.to;
    ride.driver = req.body.driver;
    ride.time = req.body.time;
    return res.jsend.success({ ride });
  }

  static deleteRide(req, res) {
    const sql = 'DELETE FROM rides WHERE id = $1';
    if (req.currentUser.id !== req.ride.user_id) return res.jsend.fail({ message: 'you can not destroy someone else ride' });

    pool((err, client, done) => {
      if (err) return res.jsend.error({ message: 'error connecting to database' });

      return client.query(sql, [req.ride.id], (error) => {
        done();
        if (error) return res.jsend.error({ message: 'error while trying to delete ride' });

        return res.jsend.success({ });
      });
    });
  }
}
export default Ride;
