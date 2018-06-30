import ridesDB from '../models/ride.model';

const getRide = (req, res, next) => {
  const { rideId } = req.params;
  const ride = ridesDB.find(c => c.id === parseInt(rideId, 10));

  if (!ride || ride === undefined || ride === null) {
    res.status(404).send({
      status: 'fail',
      data: { message: `ride with id ${rideId} was not found` },
    });
  } else {
    req.ride = ride;
    next();
  }
};

export default getRide;
