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
      if (err) return res.jsend.error({ message: 'Failed to authenticate token' });

      pool((errors, client, done) => {
        const sql = 'SELECT * FROM users WHERE id = $1';

        if (errors) return res.status(500).jsend.error({ message: 'error connecting to the database' });

        client.query(sql, [result.id], (error, results) => {
          done();
          if (error) return res.status(400).jsend.error({ message: 'Bad parameter parsed' });

          if (results.rows[0] === null || results.rows[0].length < 1 || results.rows[0] === undefined) { res.status(404).jsend.fail({ message: 'user not found for the token' }); } else {
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
