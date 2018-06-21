const { ridesDB } = require('../../../index.js');


exports.all = (req, res) => {
  if (!ridesDB) {
    return res.status(500).send({
      message: 'no rides',
    });
  }
  return res.send(ridesDB);
};
