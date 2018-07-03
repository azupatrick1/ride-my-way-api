import jwt from 'jsonwebtoken';

const jwtverify = (req, res, next) => {
  let tokengen = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    tokengen = req.headers.authorization.split(' ')[1];
  } else if (req.query && req.query.token) {
    tokengen = req.query.token;
  } else if (req.headers['x-token-access']) {
    tokengen = req.headers['x-token-access'];
  } else if (req.body.token) {
    tokengen = req.body.token;
  }


  if (!tokengen) return res.status(401).send({ status: 'fail', data: { token: 'no token provided' } });

  jwt.verify(tokengen, process.env.SECRET_KEY, (err, result) => {
    if (err) return res.status(500).send({ status: 'error', message: 'Failed to authenticate token' });

    req.decoded = result;
    return next();
  });
};


export default jwtverify;
