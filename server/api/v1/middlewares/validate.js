const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const sayError = (valid, res) => res.status(400).jsend.fail({ message: valid });

const checkbody = (item, text, res) => {
  if (!item || item === undefined || item === null) { sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    sayError(`${text} can not be empty`, res);
  } else if (item.length < 3) { sayError(`${text} must be at least 3 character long `, res); }
  return true;
};
const checkpass = (item, text, res) => {
  if (!item || item === undefined || item === null) { sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    sayError(`${text} can not be empty`, res);
  } else if (item.length < 6) { sayError(`${text} must be at least 3 character long `, res); }
  return true;
};
const checknum = (item, text, res) => {
  if (!item || item === undefined || item === null) { sayError(`${text} parameter is required`, res); } else if (typeof item !== 'number') {
    sayError(`${text} must be a number`, res);
  } else if (item < 1) {
    sayError(`${text} can not be less than one (1)`, res);
  }
  return true;
};
const checkbool = (item, text, res) => {
  if (item === undefined || item === null) { sayError(`${text} parameter is required`, res); } else if (typeof item !== 'boolean') {
    sayError(`${text} must be boolean either true or false`, res);
  }
  return true;
};

const checkemail = (item, text, res) => {
  if (!item || item === undefined || item === null) { sayError(`${text} parameter is required`, res); } else if (typeof item !== 'string') {
    sayError(`${text} must be a string`, res);
  } else if (/^\s*$/.test(item)) {
    sayError(`${text} can not be empty`, res);
  } else if (!emailRegex.test(item)) {
    sayError(`${text} is an email or is in a wrong format`, res);
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
  const { username, email, password } = req.body;
  if (username) {
    if (checkbody(username, 'username', res) === true) {
      if (checkpass(password, 'password', res) === true) {
        next();
      }
    }
  } else if (checkemail(email, 'email', res) === true) {
    if (checkpass(password, 'password', res) === true) {
      next();
    }
  }
};

export { validateRide, validateReq, validateUser, validateUsersign };
