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
    const data = [uuid(), req.body.username.toLowerCase(), hash, req.body.email];
    let user;
    pool((err, client, done) => {
      if (err) return res.status(500).jsend.error({ message: 'internal server error' });

      client.query(sql, data, (error, result) => {
        done();
        if (error && error.message.search('users_username_key') !== -1) {
          return res.status(400).jsend.error({ message: 'username already taken by another user' });
        }
        if (error && error.message.search('users_email_key') !== 1) {
          return res.status(400).jsend.error({ message: 'email already taken by another user' });
        }

        if (result) {
          if (!result.rows[0] || result.rows[0] === undefined || result.rows[0] === null || result.rows[0] < 1) {
            res.status(400).jsend.fail({ message: 'error signing up' });
          } else {
            user = result.rows;
          }
        }
        if (user) {
          token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, {
            expiresIn: 86400,
          });
        }
        res.jsend.success({ message: 'user is signed up successfully', token });
      });
    });
  }

  static verifyUser(req, res) {
    const { currentUser, ridesTaken, ridesGiven } = req;
    res.jsend.success({ currentUser, ridesGiven, ridesTaken });
  }

  static signin(req, res) {
    let sql;
    let userdata;
    let user = '';
    if (req.body.username) {
      sql = 'SELECT * FROM users WHERE username = $1';
      userdata = [req.body.username.trim().toLowerCase()];
    } else if (req.body.email) {
      sql = 'SELECT * FROM users WHERE email = $1';
      userdata = [req.body.email.trim()];
    }

    pool((err, client, done) => {
      if (err) res.status(500).jsend.error({ message: 'internal server error' });

      client.query(sql, userdata, (error, result) => {
        done();
        if (error) res.status(500).jsend.error({ message: 'error signing in  ' });

        if (!result.rows[0] || result.rows[0] === undefined || result.rows[0] === null || result.rows[0] < 1) { res.status(400).jsend.fail({ message: 'user not registered' }); } else {
          user = result.rows;

          bcrypt.compare(req.body.password, user[0].password, (errs, re) => {
            if (!re) return res.status(401).jsend.fail({ message: 'username or password not correct' });


            const token = jwt.sign({ id: user[0].id }, process.env.SECRET_KEY, {
              expiresIn: 86400,
            });

            res.jsend.success({ message: 'user is signed in successfully', token });
          });
        }
      });
    });
  }
}

export default Auth;
