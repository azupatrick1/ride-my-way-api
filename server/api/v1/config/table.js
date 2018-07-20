import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


let connectionString = '';

if (process.env.NODE_ENV === 'test') {
  connectionString = process.env.DATABASE_TEST;
} else if (process.env.NODE_ENV === 'development') {
  connectionString = process.env.DATABASE_DEV;
} else {
  connectionString = process.env.DATABASE_URL;
}
const sql = `
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS rides;
DROP TABLE IF EXISTS users;
CREATE TABLE users(id UUID PRIMARY KEY, username VARCHAR(255) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
CREATE TABLE rides(id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, slot INTEGER NOT NULL, time TIME NOT NULL, user_id UUID REFERENCES users(id) ,driver VARCHAR(255) NOT NULL, carModel VARCHAR(255) NOT NULL, takeOffDate DATE NOT NULL, status VARCHAR(40) DEFAULT 'pending', riders TEXT[] DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
CREATE TABLE requests(id SERIAL PRIMARY KEY, rider VARCHAR(255) NOT NULL, status VARCHAR(40) NOT NULL DEFAULT 'pending request', user_id UUID REFERENCES users(id), driver_id UUID NOT NULL, ride_id INTEGER REFERENCES rides(id), ride_name VARCHAR(255) NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ);
`;
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
