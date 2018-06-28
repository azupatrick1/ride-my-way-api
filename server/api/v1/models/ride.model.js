import { Pool } from 'pg';

const connectionString = 'postgres://bmeqtfwa:Q_gd2GtV5OQxnlmzHGSq_881mCb6GXSb@tantor.db.elephantsql.com:5432/bmeqtfwa';

const pool = new Pool({
  connectionString,
});
// const client = new Client({
//   connectionString,
// });
// client.connect();


pool.query('SELECT * FROM rides', (err, res) => {
  console.log(err, res);
  pool.end();
});
