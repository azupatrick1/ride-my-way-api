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
INSERT INTO users(id, username, password, email) VALUES ($1, $2, $3, $4)
`;
const data1 = [
  '0a758700-91a2-41bf-842f-eaca177243a4', 'supertest', 'supertest', 'supertest@gmail.com',
];

const data2 = [
  '568cd57e-00de-4c62-ab13-257c08348491', 'supertest2', 'supertest2', 'supertest2@gmail.com',
];

const client = new Client(connectionString);
const client2 = new Client(connectionString);
client.connect();
client2.connect();
client.query(sql, data1, (err) => {
  if (err) {
    client.end();
    console.log(err);
  } else {
    client.end();
    console.log('user inserted');
  }
});

client2.query(sql, data2, (err) => {
  if (err) {
    client2.end();
    console.log(err);
  } else {
    client2.end();
    console.log('user inserted');
  }
});
