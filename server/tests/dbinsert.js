import { Client } from 'pg';

let connectionString = '';

if (process.env.NODE_ENV === 'test') {
  connectionString = 'postgres://lcsauapj:Lh95iZltuu7Yh_N5k_IoLcOROLJKsbq-@tantor.db.elephantsql.com:5432/lcsauapj';
} else if (process.env.NODE_ENV === 'development') {
  connectionString = 'postgres://bmeqtfwa:MFlj5qwf8RuKB-sCaUxyanr9NPfnw0zY@tantor.db.elephantsql.com:5432/bmeqtfwa';
}
const sql2 = `
INSERT INTO users(id, username, password, email) VALUES($1, $2, $3, $4);
`;
const data = [
  '0a758700-91a2-41bf-842f-eaca177243a4', 'supertest', 'supertest', 'supertest@gmail.com',
];

const client = new Client(connectionString);
client.connect();
client.query(sql2, data, (err) => {
  if (err) {
    client.end();
    console.log(err.stack);
  } else {
    client.end();
    console.log('user inserted');
  }
});
