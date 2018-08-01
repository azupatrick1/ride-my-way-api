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

  static getUser(req, res) {
    const usernameparams = req.params.username.toString();
    let user = [];
    let rideTaken = [];
    let rideGiven = [];
    const getrides = (username) => {
      const sql = 'SELECT * FROM rides WHERE $1 = ANY(riders)';
      pool((err, client, done) => {
        if (err) return res.status(400).jsend.error({ message: 'error connecting to the database' });

        client.query(sql, [username], (error, result) => {
          done();
          if (error) return res.status(400).jsend.error({ message: 'wrong input parsed as parameter id' });
          if (
            !result.rows ||
            result.rows === null ||
            result.rows === undefined ||
            result.rows.length < 0
          ) {
            rideTaken = [' '];
          } else {
            rideTaken = result.rows;
            getrides(user[0].id);
          }
        });
      });
    };
    const getRequest = (username) => {
      const sql = 'SELECT * FROM rides WHERE user_id = $1';
      pool((err, client, done) => {
        if (err) { res.status(400).jsend.error({ message: 'error connecting to the database' }); } else {
          client.query(sql, [username], (error, result) => {
            done();
            if (error) {
              res.status(400).jsend.error({ message: 'wrong input parsed as parameter id' });
            } else if (
              !result.rows ||
            result.rows === null ||
            result.rows === undefined ||
            result.rows.length < 0
            ) {
              rideTaken = [' '];
            } else {
              rideGiven = result.rows;
              res.jsend.success({
                user: {
                  id: user[0].id,
                  username: user[0].username,
                  email: user[0].email,
                  joined: user[0].created_at,
                },
                rideGiven,
                rideTaken,
              });
            }
          });
        }
      });
    };

    if (!usernameparams || usernameparams === undefined) {
      res.status(400).jsend.fail({ message: 'username is required ' });
    } else {
      pool((errors, client, done) => {
        const sql = 'SELECT * FROM users WHERE username = $1';

        if (errors) { res.status(500).jsend.error({ message: 'error connecting to the database' }); } else {
          client.query(sql, [usernameparams], (error, results) => {
            done();
            if (error) {
              res.status(400).jsend.error({ message: 'Bad parameter parsed' });
            } else if (results.rows[0] === null || results.rows[0] === undefined) { res.status(404).jsend.fail({ message: 'user not found with this username' }); } else {
              user = results.rows;
              getRequest(user[0].id);
            }
          });
        }
      });
    }
  }
}

export default Auth;
