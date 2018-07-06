import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';
import pool from '../config/pgpool';

config();
class Auth {
  static signup(req, res) {
    const sql = 'INSERT INTO users(id, username, password, email) VALUES($1, $2, $3, $4) RETURNING *';
    let token;
    const hash = bcrypt.hashSync(req.body.password, 10);
    const data = [uuid(), req.body.username, hash, req.body.email];
    let user;
    pool((err, client, done) => {
      if (err) return res.jsend.error({ error: err });

      client.query(sql, data, (error, result) => {
        done();
        if (error && error.message.search('users_username_key') !== -1) {
          return res.jsend.error({ message: 'username already taken by another user' });
        }
        if (error && error.message.search('users_email_key') !== 1) {
          return res.jsend.error({ message: 'email already taken by another user' });
        }

        if (result) {
          if (!result.rows[0] || result.rows[0] === undefined || result.rows[0] === null || result.rows[0] < 1) {
            res.jsend.fail({ message: 'error signing up' });
          } else {
            user = result.rows;
          }
        }
        if (user) {
          token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, {
            expiresIn: 86400, // expires in 24 hours
          });
        }
        console.log(req.body, token, err, result, error);
        res.jsend.success({ message: 'user is signed up successfully', token });
      });
    });
  }

  static verifyUser(req, res) {
    const user = req.currentUser;

    res.jsend.success({ user });
  }

  static signin(req, res) {
    let sql;
    let userdata;
    let user = '';
    if (req.body.username) {
      sql = 'SELECT * FROM users WHERE username = $1';
      userdata = [req.body.username.trim()];
    } else if (req.body.email) {
      sql = 'SELECT * FROM users WHERE email = $1';
      userdata = [req.body.username.trim()];
    }

    pool((err, client, done) => {
      if (err) res.jsend.error({ error: err });

      client.query(sql, userdata, (error, result) => {
        done();
        if (error) res.jsend.error({ error: error.stack });

        if (!result.rows[0] || result.rows[0] === undefined || result.rows[0] === null || result.rows[0] < 1) { res.jsend.fail({ message: 'user not registered' }); } else {
          user = result.rows;

          bcrypt.compare(req.body.password, user[0].password, (errs, re) => {
            if (!re) return res.status(404).jsend.fail({ message: 'username or password not correct' });

            // create a token
            const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, {
              expiresIn: 86400, // expires in 24 hours
            });

            res.jsend.success({ message: 'user is signed in successfully', token });
          });
        }
      });
    });
  }
}

export default Auth;
