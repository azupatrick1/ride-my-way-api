import { Client } from 'pg';


const sql = `
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(id UUID PRIMARY KEY, username VARCHAR(40) UNIQUE NOT NULL, password VARCHAR(255) NOT NULL, email VARCHAR(40) UNIQUE NOT NULL, isdriver BOOLEAN, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());`;

const connectionString = process.env.DATABASE_URL || 'postgres://bmeqtfwa:MFlj5qwf8RuKB-sCaUxyanr9NPfnw0zY@tantor.db.elephantsql.com:5432/bmeqtfwa';

const client = new Client(connectionString);
client.connect();
client.query(sql, (err) => {
  if (err) {
    client.end();
    return console.log(err.stack);
  }

  console.log('user table created');
  client.end();
});

