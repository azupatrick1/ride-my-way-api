import jwt from 'jsonwebtoken';

const jwtverify = (req, res, next) => {
  const token = req.headers['x-token-access'] || req.query.token || req.body.token;

  if (!token) return res.status(401).send({ status: 'fail', data: { token: 'no token provided' } });

  jwt.verify(token, process.env.SECRET_KEY, (err, result) => {
    if (err) return res.status(500).send({ status: 'error', message: 'Failed to authenticate token' });

    req.decoded = result;
    return next();
  });
};

export default jwtverify;
