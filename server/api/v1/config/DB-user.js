import { Client } from 'pg';


const sql = `
DROP TABLE IF EXISTS users;
CREATE TABLE users(id UUID PRIMARY KEY, username VARCHAR(40) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;

const connectionString = process.env.DATABASE_URL || 'postgres://bmeqtfwa:MFlj5qwf8RuKB-sCaUxyanr9NPfnw0zY@tantor.db.elephantsql.com:5432/bmeqtfwa';

const client = new Client(connectionString);
client.connect();
client.query(sql, (err) => {
  if (err) {
    client.end();
    return console.log(err.stack);
  }
  client.end();
  return console.log('user table created');
});

