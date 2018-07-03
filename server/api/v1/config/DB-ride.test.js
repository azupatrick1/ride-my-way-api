import { Client } from 'pg';


const sql = `
DROP TABLE IF EXISTS rides;
CREATE TABLE rides(id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, destination VARCHAR(255) NOT NULL, slot INTEGER NOT NULL, time TIME NOT NULL, user_id UUID REFERENCES users(id) ,created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;

const connectionString = process.env.DATABASE_URL || 'postgres://lcsauapj:Lh95iZltuu7Yh_N5k_IoLcOROLJKsbq-@tantor.db.elephantsql.com:5432/lcsauapj';

const client = new Client(connectionString);
client.connect();
client.query(sql, (err) => {
  if (err) {
    client.end();
    return console.log(err.stack);
  }
  client.end();
  return console.log('ride test table created');
});

