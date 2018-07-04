import jwt from 'jsonwebtoken';
import pool from '../config/pgpool';


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


  if (!tokengen) return res.jsend.fail({ token: 'no token provided' });

  return jwt.verify(tokengen, process.env.SECRET_KEY, (err, result) => {
    if (err) return res.jsend.error({ message: 'Failed to authenticate token' });

    pool((errors, client, done) => {
      const sql = 'SELECT * FROM users WHERE id = $1';

      if (errors) return res.jsend.error({ errors });

      client.query(sql, [result.id], (error, results) => {
        done();
        if (error) return res.jsend.error({ error: error.stack });

        if (!result) return res.jsend.fail({ message: 'user not found for the token' });

        req.currentUser = results.rows[0];
        next();
      });
    });
  });
};


export default jwtverify;
