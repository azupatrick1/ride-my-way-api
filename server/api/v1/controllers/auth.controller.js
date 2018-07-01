import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import pool from '../config/pgpool';

config();

export function signup(req, res) {
  const sql = 'INSERT INTO users(id, username, password, email, isdriver) VALUES($1, $2, $3, $4, $5) RETURNING *';

  const hash = bcrypt.hashSync(req.body.password, 10);
  const data = [uuid(), req.body.username, hash, req.body.email, req.body.is_a_driver];

  pool((err, client, done) => {
    if (err) return res.status(500).send({ error: err });

    return client.query(sql, data, (error, result) => {
      done();
      if (error) return res.status(500).send({ status: 'error', error: error.stack });

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
