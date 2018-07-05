// import pool from './pgpool';
import { Client } from 'pg';

let connectionString = '';

if (process.env.NODE_ENV === 'test') {
  connectionString = 'postgres://lcsauapj:Lh95iZltuu7Yh_N5k_IoLcOROLJKsbq-@tantor.db.elephantsql.com:5432/lcsauapj';
} else if (process.env.NODE_ENV === 'development') {
  connectionString = 'postgres://bmeqtfwa:MFlj5qwf8RuKB-sCaUxyanr9NPfnw0zY@tantor.db.elephantsql.com:5432/bmeqtfwa';
}
const sql = `
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS users;
CREATE TABLE users(id UUID PRIMARY KEY, username VARCHAR(40) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE rides(id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, slot INTEGER NOT NULL, time TIME NOT NULL, user_id UUID REFERENCES users(id) , riders TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
CREATE TABLE requests(id SERIAL PRIMARY KEY, rider VARCHAR(255) NOT NULL, status VARCHAR(40) NOT NULL DEFAULT 'sent', user_id UUID REFERENCES users(id) , ride_id INTEGER REFERENCES rides(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
`;
// const sqluser = `
// DROP TABLE IF EXISTS requests;
// DROP TABLE IF EXISTS rides;
// DROP TABLE IF EXISTS users;
// CREATE TABLE users(id UUID PRIMARY KEY, username VARCHAR(40) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
// `;
// const sqlride = `
// CREATE TABLE rides(id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, slot INTEGER NOT NULL, time TIME NOT NULL, user_id UUID REFERENCES users(id) , riders TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
// `;
// const sqlrequest = `
// CREATE TABLE requests(id SERIAL PRIMARY KEY, rider VARCHAR(255) NOT NULL, status VARCHAR(40) NOT NULL, user_id UUID REFERENCES users(id) , ride_id INTEGER REFERENCES rides(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
// ALTER TABLE requests ALTER COLUMN status SET DEFAULT 'sent';
// `;
// pool((err, client, done) => {
//   if (err) return console.error('error connecting to database');

//   return client.query(sqluser, (error, result) => {
//     done();
//     if (error) return console.error(error.stack);
//     if (result) {
//       console.log('table for users created');

//       return client.query(sqlride, (error1, resultride) => {
//         done();
//         if (error1) return console.error(error.stack);
//         if (resultride) {
//           console.log('table for users created');

//           return client.query(sqlrequest, (error2, resultreq) => {
//             done();
//             if (error2) return console.error(error.stack);
//             if (resultreq) {
//               console.log('table for request created');
//             }
//           });
//         }
//       });
//     }
//   });
// });

const client = new Client(connectionString);
client.connect();
client.query(sql, (err) => {
  if (err) {
    client.end();
    console.log(err.stack);
  } else {
    client.end();
    console.log('all table created');
  }
});
