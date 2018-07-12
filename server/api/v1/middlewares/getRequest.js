import pool from '../config/pgpool';

const getRequest = (req, res, next) => {
  if (typeof Number(req.params.requestId) !== 'number') {
    res.status(400).jsend.fail({ message: 'wrong format of requestId supplied at the url ' });
  } else {
    const sql = 'SELECT * FROM requests WHERE id = $1';
    pool((err, client, done) => {
      if (err) res.status(500).jsend.error({ message: 'error connecting to database' });

      client.query(sql, [Number(req.params.requestId)], (error, result) => {
        done();
        if (error) return res.status(400).jsend.error({ message: 'wrong input parsed as parameter id' });

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
  }
};

export default getRequest;
