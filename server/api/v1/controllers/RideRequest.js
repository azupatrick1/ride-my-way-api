
import pool from '../config/pgpool';

class RideRequest {
  static getAllRequest(req, res) {
    const { ride } = req;

    if (ride.user_id !== req.currentUser.id) {
      const sql = 'SELECT * FROM requests WHERE user_id = $1 AND ride_id = $2';
      pool((err, client, done) => {
        if (err) res.jsend.error({ message: 'error connecting to database' });

        client.query(sql, [req.currentUser.id, ride.id], (error, result) => {
          done();
          if (error) res.jsend.error({ error: error.stack });
          if (!result || result === undefined) { res.jsend.fail({ message: 'you have sent no request to this ride' }); } else {
            res.jsend.success({ request: result.rows[0] });
          }
        });
      });
    } else {
      const sql = 'SELECT * FROM requests WHERE ride_id = $1';
      pool((err, client, done) => {
        if (err) res.jsend.error({ message: 'error connecting to database' });

        client.query(sql, [ride.id], (error, result) => {
          done();
          if (error) res.jsend.error({ error: error.stack });
          if (!result || result === undefined || result.rows.length === 0) { res.jsend.fail({ status: 'fail', message: 'you have no request to this ride' }); } else {
            res.jsend.success({ requests: result.rows });
          }
        });
      });
    }
  }

  static createRequest(req, res) {
    const { ride } = req;
    const data = [req.currentUser.username, req.currentUser.id, ride.id];

    const sql = 'INSERT INTO requests(rider, user_id, ride_id) VALUES($1, $2, $3) RETURNING *';
    if (ride.user_id === req.currentUser.id) { res.status(403).jsend.fail({ message: 'you can not request your own ride' }); } else {
      pool((err, client, done) => {
        if (err) res.jsend.error({ error: err });

        client.query(sql, data, (error, request) => {
          done();
          if (error) res.jsend.error({ error: error.stack });

          res.jsend.success({ request: request.rows[0] });
        });
      });
    }
  }

  static decideRequestOption(req, res) {
    if (req.currentUser.id === req.ride.user_id) {
      const alterRequest = (status) => {
        const sql = 'UPDATE requests SET status = $1 WHERE id = $2';

        pool((err, client, done) => {
          if (err) res.jsend.error({ message: 'error connecting to database' });

          client.query(sql, [status, req.request.id], (error) => {
            done();
            if (error) res.jsend.error({ message: error.stack });
          });
        });
      };

      if (req.body.accept === true) {
        const sql = 'UPDATE rides SET riders = array_append( riders, $1 ) WHERE id = $2';
        pool((err, client, done) => {
          if (err) res.jsend.error({ message: 'error connecting to database' });

          client.query(sql, [req.request.rider, req.ride.id], (error, result) => {
            done();
            if (error) res.jsend.error({ message: error.stack });
            if (!result || result === undefined) { res.status(404).jsend.fail({ message: 'you have  no request to this ride' }); } else {
              res.jsend.success({ message: 'you have accepted this request' });
              alterRequest('Accepted');
            }
          });
        });
      } else {
        res.jsend.success({ message: 'you have rejected this request' });
        alterRequest('Rejected');
      }
    } else {
      res.status(403).jsend.fail({ message: 'you don\'t have the priviledge to access this endpoint ' });
    }
  }
}
export default RideRequest;

