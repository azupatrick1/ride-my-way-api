import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import pool from '../config/pgpool';

config();

export function signup(req, res) {
  const sql = 'INSERT INTO users(id, username, password, email) VALUES($1, $2, $3, $4) RETURNING *';

  const hash = bcrypt.hashSync(req.body.password, 10);
  const data = [uuid(), req.body.username, hash, req.body.email];

  pool((err, client, done) => {
    if (err) return res.status(500).send({ error: err });

    return client.query(sql, data, (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      // if (error) {
      //   if (JSON.stringify(error).indexOf('d') > -1) {
      //     if (JSON.stringify(error).indexOf('q') > -1) {
      //       return res.status(500).send({ status: 'error', error: 'User name already exist' });
      //     }
      //     return res.status(500).send({ status: 'error', error: 'email already exist' });
      //   }
      //   return res.status(500).send({ status: 'error', error: error.stack });
      // }

      // create a token
      const token = jwt.sign({ id: result.rows[0].id }, process.env.SECRET_KEY, {
        expiresIn: 86400, // expires in 24 hours
      });

      return res.status(200).send({
        status: 'success',
        data: { token },
      });
    });
  });
}

export function verifyUser(req, res) {
  const sql = 'SELECT * FROM users WHERE id = $1';
  const userid = req.decoded.id;
  pool((err, client, done) => {
    if (err) return res.status(500).send({ status: 'error', error: err });

    return client.query(sql, [userid], (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      if (!result) return res.status(404).send({ status: 'fail', message: 'user not found for the token' });

      return res.status(200).send({
        status: 'success',
        data: { user: result.rows[0] },
      });
    });
  });
}

export function signin(req, res) {
  const sql = 'SELECT * FROM users WHERE username = $1';
  let user = '';
  const userdata = [req.body.username];
  pool((err, client, done) => {
    if (err) return res.status(500).send({ status: 'error', error: err });

    return client.query(sql, userdata, (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

      if (!result || result === undefined || result === null) return res.status(404).send({ status: 'fail', message: 'user not registered' });

      user = result.rows;

      return bcrypt.compare(req.body.password, user[0].password, (errs, re) => {
        if (!re) return res.status(404).send({ status: 'fail', message: 'password not correct' });

        // create a token
        const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, {
          expiresIn: 86400, // expires in 24 hours
        });

        return res.status(200).send({
          status: 'success',
          data: { token },
        });
      });
    });
  });
}
