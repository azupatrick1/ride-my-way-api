import requestDB from '../models/rideRequest';
import pool from '../config/pgpool';

class RideRequest {
  static all(req, res) {
    const { ride } = req;
    function filterRequest(request) {
      return request.rideId === Number(ride.id);
    }
    const request = requestDB.filter(filterRequest);
    if (!request || request.length < 1 || request === undefined || request === null) {
      return res.status(404).send({
        status: 'fail',
        data: { message: 'There is no request for this ride ' },
      });
    }
    return res.send({
      status: 'success',
      data: { 'ride requests': request },
    });
  }

  static create(req, res) {
    const { ride } = req;
    //   const request = {
    //     id: requestDB.length + 1,
    //     rideId: ride.id,
    //     rideName: ride.name,
    //     sender: req.body.sender,
    //     status: 'sent',
    //   };
    //   requestDB.push(request);
    //   return res.status(201).send({
    //     status: 'success',
    //     data: { 'ride request': request },
    //   });
    // }
    const data = [req.decoded.id, ride.id];

    const sql = 'INSERT INTO requests(user_id, ride_id) VALUES($1, $2) RETURNING *';


    pool((err, client, done) => {
      if (err) return res.status(500).send({ error: err });

      return client.query(sql, data, (error, request) => {
        done();
        if (error) return res.status(500).send({ status: 'error', error: error.stack });

        return res.status(201).send({
          status: 'success',
          data: { request: request.rows[0] },
        });
      });
    });
  }
}
export default RideRequest;

