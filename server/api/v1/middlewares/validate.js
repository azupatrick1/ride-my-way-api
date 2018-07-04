const emailRegex = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
const sayError = (valid, res) => res.jsend({ message: valid });

const checkbody = (item, text, res) => {
  if (!item || item === undefined || item === null) { return sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    return sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    return sayError(`${text} can not be empty`, res);
  } else if (item.length < 3) { return sayError(`${text} must be at least 3 character long `, res); }
  return true;
};
const checkpass = (item, text, res) => {
  if (!item || item === undefined || item === null) { return sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    return sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    return sayError(`${text} can not be empty`, res);
  } else if (item.length < 6) { return sayError(`${text} must be at least 3 character long `, res); }
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
const checkbool = (item, text, res) => {
  if (!item || item === undefined || item === null) { return sayError(`${text} parameter is required`, res); } else if (typeof item !== 'boolean') {
    return sayError(`${text} must be boolean either true or false`, res);
  }
  return true;
};

const checkemail = (item, text, res) => {
  if (!item || item === undefined || item === null) { return sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    return sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    return sayError(`${text} can not be empty`, res);
  } else if (!emailRegex.test(item)) {
    return sayError(`${text} is an email or is in a wrong format`, res);
  }
  return true;
};

const validateRide = (req, res, next) => {
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

const validateReq = (req, res, next) => {
  const { accept } = req.body;
  if (checkbool(accept, 'accept', res) === true) {
    next();
  }
};

const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  if (checkbody(username, 'username', res) === true) {
    if (checkemail(email, 'email', res) === true) {
      if (checkpass(password, 'password', res) === true) {
        next();
      }
    }
  }
};

const validateUsersign = (req, res, next) => {
  const { username, password } = req.body;
  if (checkbody(username, 'username', res) === true) {
    if (checkpass(password, 'password', res) === true) {
      next();
    }
  }
};

export { validateRide, validateReq, validateUser, validateUsersign };
