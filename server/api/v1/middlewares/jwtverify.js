import jwt from 'jsonwebtoken';
import pool from '../config/pgpool';


const jwtverify = (req, res, next) => {
  let tokengen = null;
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const head = req.headers.authorization.split(' ')[1];
    tokengen = head;
  } else if (req.query && req.query.token) {
    tokengen = req.query.token;
  } else if (req.headers['x-token-access']) {
    tokengen = req.headers['x-token-access'];
  } else if (req.body.token) {
    tokengen = req.body.token;
  }


  if (!tokengen) { res.jsend.fail({ token: 'no token provided' }); } else {
    jwt.verify(tokengen, process.env.SECRET_KEY, (err, result) => {
      if (err) res.jsend.error({ message: 'Failed to authenticate token' });

      pool((errors, client, done) => {
        const sql = 'SELECT * FROM users WHERE id = $1';

        if (errors) res.jsend.error({ message: errors });

        client.query(sql, [result.id], (error, results) => {
          done();
          if (error) res.jsend.error({ message: error.stack });

          if (results.rows === null || results.rows.length < 1 || results.rows === undefined) { res.jsend.fail({ message: 'user not found for the token' }); } else {
            const user = results.rows[0];
            req.currentUser = user;
            next();
          }
        });
      });
    });
  }
};


export default jwtverify;
