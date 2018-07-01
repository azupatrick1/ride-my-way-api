import pg from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgres://bmeqtfwa:MFlj5qwf8RuKB-sCaUxyanr9NPfnw0zY@tantor.db.elephantsql.com:5432/bmeqtfwa';

const pool = pg.Pool({ connectionString });
export default function (callback) {
  pool.connect((err, client, done) => callback(err, client, done));
}
