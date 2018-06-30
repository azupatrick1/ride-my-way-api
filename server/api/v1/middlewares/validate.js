export const validateRide = (req, res, next) => {
  const {
    name, from, to, driver, time,
  } = req.body;
  function sayError(valid) {
    return res.status(400).send({
      status: 'fail',
      data: { message: valid },
    });
  }


  if (!name || name === undefined || name === null) {
    sayError(' name parameter is required');
  } else if (typeof name !== 'string') {
    sayError('name must be a string');
  } else if (/^\s*$/.test(name)) {
    sayError('name can not be empty');
  } else if (name.length < 3) {
    sayError('name must be at least 3 character long ');
  } else if (!from || from === undefined || from === null) {
    sayError(' from parameter is required');
  } else if (typeof from !== 'string') {
    sayError('from must be a string');
  } else if (/^\s*$/.test(from)) {
    sayError('from can not be empty');
  } else if (from.length < 3) {
    sayError('from must be at least 3 character long ');
  } else if (!to || to === undefined || to === null) {
    sayError('to parameter is required');
  } else if (typeof to !== 'string') {
    sayError('to must be a string');
  } else if (/^\s*$/.test(to)) {
    sayError('to can not be empty');
  } else if (name.length < 3) {
    sayError('to must be at least 3 character long ');
  } else if (!driver || driver === undefined || driver === null) {
    sayError('driver parameter is required');
  } else if (typeof driver !== 'string') {
    sayError('driver must be a string');
  } else if (/^\s*$/.test(driver)) {
    sayError('driver can not be empty');
  } else if (driver.length < 3) {
    sayError('driver must be at least 3 character long ');
  } else if (!time || time === undefined || time === null) {
    sayError('time parameter is required');
  } else if (typeof name !== 'string') {
    sayError('time must be a string');
  } else if (/^\s*$/.test(time)) {
    sayError('time can not be empty');
  } else if (time.length < 3) {
    sayError('time must be at least 3 character long ');
  } else {
    next();
  }
};

export const validateRequest = (req, res, next) => {
  const { sender } = req.body;
  function sayError(valid) {
    return res.status(400).send({
      status: 'fail',
      data: { message: valid },
    });
  }


  if (!sender || sender === undefined || sender === null) {
    sayError(' sender parameter is required');
  } else if (typeof sender !== 'string') {
    sayError('sender must be a string');
  } else if (/^\s*$/.test(sender)) {
    sayError('sender can not be empty');
  } else if (sender.length < 3) {
    sayError('sender must be at least 3 character long ');
  } else {
    next();
  }
};

