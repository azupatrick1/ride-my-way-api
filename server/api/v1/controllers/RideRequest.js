import requestDB from '../models/rideRequest';

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
    const request = {
      id: requestDB.length + 1,
      rideId: ride.id,
      rideName: ride.name,
      sender: req.body.sender,
      status: 'sent',
    };
    requestDB.push(request);
    return res.status(201).send({
      status: 'success',
      data: { 'ride request': request },
    });
  }
}

export default RideRequest;
