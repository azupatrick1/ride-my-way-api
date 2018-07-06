
const validateReq = (req, res, next) => {
  const { accept } = req.body;

  if (accept === undefined || accept === null) {
    return res.status(400).jsend.fail({ message: 'accept  parameter is required' });
  }

  if (typeof accept !== 'boolean') {
    return res.status(400).jsend.fail({ message: 'accept must be boolean either true or false' });
  }
  return next();
};
export default validateReq;
