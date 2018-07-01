import pool from './pgpool';

export default function create(values) {
  const sql = 'INSERT INTO users(id, username, password, email, isdriver) VALUES($1, $2, $3, $4, $5)';

  const result = pool(sql, values);

  return result;
}
