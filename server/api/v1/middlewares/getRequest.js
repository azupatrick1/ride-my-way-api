import pool from '../config/pgpool';

const getRequest = (req, res, next) => {
  const sql = 'SELECT * FROM requests WHERE id = $1';
  pool((err, client, done) => {
    if (err) res.jsend.error({ message: err });

    client.query(sql, [req.params.requestId], (error, result) => {
      done();
      if (error) res.jsend.error({ message: error.stack });

      if (!result.rows[0] || result.rows[0] === null || result.rows[0] === undefined
        || result.rows[0].length < 0) {
        res.status(404).jsend.fail({ message: `request with id ${req.params.requestId} was not found` });
      } else {
        const request = result.rows[0];
        req.request = request;

        next();
      }
    });
  });
};

export default getRequest;
