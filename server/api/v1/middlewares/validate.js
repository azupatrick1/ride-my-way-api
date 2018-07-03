const sayError = (valid, res) => res.status(400).send({ status: 'fail', data: { message: valid } });

const checkbody = (item, text, res) => {
  if (!item || item === undefined || item === null) { return sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    return sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    return sayError(`${text} can not be empty`, res);
  } else if (item.length < 3) { return sayError(`${text} must be at least 3 character long `, res); }
  return true;
};
const checknum = (item, text, res) => {
  if (!item || item === undefined || item === null) { return sayError(`${text} parameter is required`, res); } else if (typeof item !== 'number') {
    return sayError(`${text} must be a number`, res);
  } else if (item < 1) {
    return sayError(`${text} can not be less than one (1)`, res);
  }
  return true;
};

export const validateRide = (req, res, next) => {
  const {
    name, location, destination, slot, time,
  } = req.body;
  if (checkbody(name, 'name', res) === true) {
    if (checkbody(location, 'location', res) === true) {
      if (checkbody(destination, 'destination', res) === true) {
        if (checknum(slot, 'slot', res) === true) {
          if (checkbody(time, 'time', res) === true) {
            next();
          }
        }
      }
    }
  }
};
export const validateRequest = (req, res, next) => {
  const { sender } = req.body;
  if (checkbody(sender, 'sender', res) === true) { next(); }
};

