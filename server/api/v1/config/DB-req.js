import { Client } from 'pg';


const sql = `
DROP TABLE IF EXISTS requests;
CREATE TABLE requests(id SERIAL PRIMARY KEY, sender VARCHAR(255) NOT NULL, status VARCHAR(40) NOT NULL, user_id UUID REFERENCES users(id) , ride_id INTEGER REFERENCES rides(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL);
ALTER TABLE requests ALTER COLUMN status SET DEFAULT 'sent';
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
  return console.log('requests table created');
});

