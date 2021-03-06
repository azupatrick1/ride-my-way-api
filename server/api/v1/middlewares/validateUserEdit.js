const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const white = /^\s*$/;
const whitetext = /[^\S]/g;
const validateUserEdit = (req, res, next) => {
  const {
    username, email, newPassword, confirmPassword,
  } = req.body;

  if (!username || username === undefined || username === null) {
    return res.status(400).jsend.fail({ message: 'username parameter is required' });
  }

  if (!email || email === undefined || email === null) {
    return res.status(400).jsend.fail({ message: 'username or email parameter is required' });
  }

  if (username && typeof username !== 'string') {
    return res.status(400).jsend.fail({ message: 'username must be a string' });
  }
  if (username && white.test(username)) {
    return res.status(400).jsend.fail({ message: 'username can not be empty' });
  }

  if (username && username.length < 3) {
    return res.status(400).jsend.fail({ message: 'username must be at least 3 character long ' });
  }
  if (username && whitetext.test(username)) {
    return res.status(400).jsend.fail({ message: 'username can not have white spaces' });
  }

  if (email && typeof email !== 'string') {
    return res.status(400).jsend.fail({ message: 'email must be a string' });
  }
  if (email && white.test(email)) {
    return res.status(400).jsend.fail({ message: 'email cannot be empty' });
  }

  if (email && !emailRegex.test(email)) {
    return res.status(400).jsend.fail({ message: 'please enter a valid email' });
  }
  if (newPassword && typeof newPassword !== 'string') {
    return res.status(400).jsend.fail({ message: 'new Password must be a string' });
  }
  if (newPassword && white.test(newPassword)) {
    return res.status(400).jsend.fail({ message: 'new Password can not be empty' });
  }

  if (newPassword && newPassword.length < 3) {
    return res.status(400).jsend.fail({ message: 'new Password must be at least 3 character long ' });
  }
  if (newPassword && whitetext.test(newPassword)) {
    return res.status(400).jsend.fail({ message: 'new Password can not have white spaces' });
  }
  if ((username || email) && (!confirmPassword ||
    confirmPassword === undefined || confirmPassword === null)) {
    return res.status(400).jsend.fail({ message: 'confirm password  parameter is required' });
  }

  if ((username || email) && typeof confirmPassword !== 'string') {
    return res.status(400).jsend.fail({ message: 'password must be a string' });
  }
  if ((username || email) && white.test(confirmPassword)) {
    return res.status(400).jsend.fail({ message: 'password can not be empty' });
  }


  return next();
};
export default validateUserEdit;
