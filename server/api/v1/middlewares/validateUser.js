const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const white = /^\s*$/;
const whitetext = /[^\S]/g;
const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || username === undefined || username === null) {
    return res.status(400).jsend.fail({ message: 'username  parameter is required' });
  }

  if (typeof username !== 'string') {
    return res.status(400).jsend.fail({ message: 'username must be a string' });
  }
  if (white.test(username)) {
    return res.status(400).jsend.fail({ message: 'username can not be empty' });
  }

  if (username.length < 3) {
    return res.status(400).jsend.fail({ message: 'username must be at least 3 character long ' });
  }
  if (whitetext.test(username)) {
    return res.status(400).jsend.fail({ message: 'username can not have white spaces' });
  }

  if (!email || email === undefined || email === null) {
    return res.status(400).jsend.fail({ message: 'email  parameter is required' });
  }
  if (typeof email !== 'string') {
    return res.status(400).jsend.fail({ message: 'email must be a string' });
  }
  if (white.test(email)) {
    return res.status(400).jsend.fail({ message: 'email cannot be empty' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).jsend.fail({ message: 'please enter a valid email' });
  }

  if (!password || password === undefined || password === null) {
    return res.status(400).jsend.fail({ message: 'password  parameter is required' });
  }

  if (typeof password !== 'string') {
    return res.status(400).jsend.fail({ message: 'password must be a string' });
  }
  if (white.test(password)) {
    return res.status(400).jsend.fail({ message: 'password can not be empty' });
  }

  if (password.length < 6) {
    return res.status(400).jsend.fail({ message: 'password must be at least 6 character long ' });
  }
  if (whitetext.test(password)) {
    return res.status(400).jsend.fail({ message: 'password can not have white spaces' });
  }

  return next();
};
export default validateUser;
