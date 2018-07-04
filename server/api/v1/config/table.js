import pool from './pgpool';

const sqluser = `
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS users;
CREATE TABLE users(id UUID PRIMARY KEY, username VARCHAR(40) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;
const sqlride = `
CREATE TABLE rides(id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, slot INTEGER NOT NULL, time TIME NOT NULL, user_id UUID REFERENCES users(id) , riders TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
`;
const sqlrequest = `
CREATE TABLE requests(id SERIAL PRIMARY KEY, rider VARCHAR(255) NOT NULL, status VARCHAR(40) NOT NULL, user_id UUID REFERENCES users(id) , ride_id INTEGER REFERENCES rides(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
ALTER TABLE requests ALTER COLUMN status SET DEFAULT 'sent';
`;
const pooler = pool((err, client, done) => {
  if (err) return console.error('error connecting to database');

  return client.query(sqluser, (error, result) => {
    done();
    if (error) return console.error(error.stack);
    if (result) {
      console.log('table for users created');

      return client.query(sqlride, (error1, resultride) => {
        done();
        if (error1) return console.error(error.stack);
        if (resultride) {
          console.log('table for users created');

          return client.query(sqlrequest, (error2, resultreq) => {
            done();
            if (error2) return console.error(error.stack);
            if (resultreq) {
              console.log('table for request created');
            }
          });
        }
      });
    }
  });
});

setTimeout(() => pooler, 200);
