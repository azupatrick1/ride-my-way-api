// import requestDB from '../models/rideRequest';
import pool from '../config/pgpool';

class RideRequest {
  static all(req, res) {
    const { ride } = req;

    if (ride.user_id !== req.currentUser.id) {
      const sql = 'SELECT * FROM requests WHERE user_id = $1 AND ride_id = $2';
      pool((err, client, done) => {
        if (err) return res.jsend.error({ message: 'error connecting to database' });

        return client.query(sql, [req.currentUser.id, ride.id], (error, result) => {
          done();
          if (error) return res.jsend.error({ error: error.stack });
          if (!result || result === undefined) return res.jsend.fail({ message: 'you have sent no request to this ride' });
          return res.jsend.success({ request: result.rows[0] });
        });
      });
    }

    const sql = 'SELECT * FROM requests WHERE ride_id = $1';
    pool((err, client, done) => {
      if (err) return res.jsend.error({ message: 'error connecting to database' });

      return client.query(sql, [ride.id], (error, result) => {
        done();
        if (error) return res.jsend.error({ error: error.stack });
        if (!result || result === undefined || result.rows.length === 0) return res.jsend.fail({ status: 'fail', message: 'you have no request to this ride' });
        return res.jsend.success({ request: result.rows });
      });
    });
  }

  static create(req, res) {
    const { ride } = req;
    const data = [req.currentUser.username, req.currentUser.id, ride.id];

    const sql = 'INSERT INTO requests(rider, user_id, ride_id) VALUES($1, $2, $3) RETURNING *';
    if (ride.user_id === req.currentUser.id) return res.jsend.fail({ message: 'you can not request your own ride' });

    return pool((err, client, done) => {
      if (err) return res.jsend.error({ error: err });

      return client.query(sql, data, (error, request) => {
        done();
        if (error) return res.jsend.error({ error: error.stack });

        return res.jsend.success({ request: request.rows[0] });
      });
    });
  }
}
export default RideRequest;

