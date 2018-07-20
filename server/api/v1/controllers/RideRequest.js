
import pool from '../config/pgpool';

class RideRequest {
  static getAllRequest(req, res) {
    const { ride } = req;

    if (ride.user_id !== req.currentUser.id) {
      const sql = 'SELECT * FROM requests WHERE user_id = $1 AND ride_id = $2';
      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sql, [req.currentUser.id, ride.id], (error, result) => {
          done();
          if (error) return res.status(400).jsend.error({ error: 'error getting request' });
          if (!result || result === undefined) { res.status(404).jsend.fail({ message: 'you have sent no request to this ride' }); } else {
            res.jsend.success({ request: result.rows[0] });
          }
        });
      });
    } else {
      const sql = 'SELECT * FROM requests WHERE ride_id = $1';
      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sql, [ride.id], (error, result) => {
          done();
          if (error) return res.status(400).jsend.error({ error: 'error getting request' });
          if (!result || result === undefined || result.rows.length === 0) { res.status(404).jsend.fail({ status: 'fail', message: 'you have no request to this ride' }); } else {
            res.jsend.success({ requests: result.rows });
          }
        });
      });
    }
  }

  static createRequest(req, res) {
    const { ride } = req;
    const data = [req.currentUser.username, req.currentUser.id, ride.user_id, ride.id, ride.name];
    const { slot } = req.ride;
    const sql = 'INSERT INTO requests(rider, user_id, driver_id, ride_id, ride_name) VALUES($1, $2, $3, $4, $5) RETURNING *';

    const alterRide = (lot) => {
      const sqlr = 'UPDATE rides SET slot = $1 WHERE id = $2';

      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sqlr, [lot, req.ride.id], (error) => {
          done();
          if (error) res.status(400).jsend.error({ message: 'error creating request' });
        });
      });
    };
    if (ride.status === 'cancelled') {
      res.status(400).jsend.fail({ message: 'you are can not make request to a cancelled ride' });
    } else if (slot <= 0) {
      res.status(400).jsend.fail({ message: 'you are denied: slot is filled up' });
    } else if (ride.user_id === req.currentUser.id) {
      res.status(403).jsend.fail({ message: 'you can not request your own ride' });
    } else {
      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ error: 'error connecting to database' });

        client.query(sql, data, (error, request) => {
          done();
          if (error) res.status(400).jsend.error({ error: 'error creating request' });
          alterRide(slot - 1);
          res.jsend.success({ request: request.rows[0] });
        });
      });
    }
  }


  static decideRequestOption(req, res) {
    if (req.request.status === 'Accepted' || req.request.status === 'Rejected') {
      return res.jsend.fail({ message: 'ride request is already accepted or rejected' });
    }
    if (req.currentUser.id !== req.ride.user_id) {
      return res.status(403).jsend.fail({ message: 'you don\'t have the priviledge to access this endpoint ' });
    }

    const alterRequest = (status) => {
      const sql = 'UPDATE requests SET status = $1 WHERE id = $2';

      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sql, [status, req.request.id], (error) => {
          done();
          if (error) res.status(500).jsend.error({ message: 'could not access request' });
        });
      });
    };

    if (req.body.accept === true) {
      const sql = 'UPDATE rides SET riders = array_append( riders, $1 ) WHERE id = $2';
      pool((err, client, done) => {
        if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

        client.query(sql, [req.request.rider, req.ride.id], (error, result) => {
          done();
          if (error) res.status(500).jsend.error({ message: 'error updating ride' });
          if (!result || result === undefined) { res.status(404).jsend.fail({ message: 'you have  no request to this ride' }); } else {
            res.jsend.success({ message: 'you have accepted this request' });
            alterRequest('Accepted');
          }
        });
      });
    } else {
      const sql = 'UPDATE rides SET slot = $1 WHERE id = $2';
      pool((err, client, done) => {
        if (err) return res.status(500).jsend.error({ message: 'error connecting to database' });
        client.query(sql, [req.ride.slot + 1, req.ride.id], (error) => {
          done();
          if (error) return res.status(500).jsend.error({ message: 'error updating rie slot' });
          alterRequest('Rejected');
          res.jsend.success({ message: 'you have rejected this request' });
        });
      });
    }
  }

  static getAllEverRequests(req, res) {
    const { requestRecieve, requestSent } = req;

    res.jsend.success({ requestRecieve, requestSent });
  }
}

export default RideRequest;
