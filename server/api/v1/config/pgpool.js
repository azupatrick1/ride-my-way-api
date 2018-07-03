import pg from 'pg';

let connectionString = '';

if (process.env.NODE_ENV === 'test') {
  connectionString = 'postgres://lcsauapj:Lh95iZltuu7Yh_N5k_IoLcOROLJKsbq-@tantor.db.elephantsql.com:5432/lcsauapj';
} else if (process.env.NODE_ENV === 'development') {
  connectionString = 'postgres://bmeqtfwa:MFlj5qwf8RuKB-sCaUxyanr9NPfnw0zY@tantor.db.elephantsql.com:5432/bmeqtfwa';
} else {
  connectionString = process.env.DATABASE_URL;
}


const pool = pg.Pool({ connectionString });
export default function (callback) {
  pool.connect((err, client, done) => callback(err, client, done));
}
