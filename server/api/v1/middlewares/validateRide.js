const white = /^\s*$/;
const whitetext = /[^\S]/g;
const timeRegex = /^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const validateUser = (req, res, next) => {
  const {
    name, location, destination, slot, time, carModel, takeOffDate,
  } = req.body;

  if (!name || name === undefined || name === null) {
    return res.status(400).jsend.fail({ message: 'name  parameter is required' });
  }

  if (typeof name !== 'string') {
    return res.status(400).jsend.fail({ message: 'name must be a string' });
  }
  if (white.test(name)) {
    return res.status(400).jsend.fail({ message: 'name can not be empty' });
  }

  if (name.length < 3) {
    return res.status(400).jsend.fail({ message: 'name must be at least 3 character long ' });
  }
  if (whitetext.test(name)) {
    return res.status(400).jsend.fail({ message: 'name can not have white spaces' });
  }

  if (!location || location === undefined || location === null) {
    return res.status(400).jsend.fail({ message: 'location  parameter is required' });
  }

  if (typeof location !== 'string') {
    return res.status(400).jsend.fail({ message: 'location must be a string' });
  }
  if (white.test(location)) {
    return res.status(400).jsend.fail({ message: 'location can not be empty' });
  }

  if (location.length < 3) {
    return res.status(400).jsend.fail({ message: 'location must be at least 3 character long ' });
  }
  if (whitetext.test(location)) {
    return res.status(400).jsend.fail({ message: 'location can not have white spaces' });
  }

  if (!destination || destination === undefined || destination === null) {
    return res.status(400).jsend.fail({ message: 'destination  parameter is required' });
  }

  if (typeof destination !== 'string') {
    return res.status(400).jsend.fail({ message: 'destination must be a string' });
  }
  if (white.test(destination)) {
    return res.status(400).jsend.fail({ message: 'destination can not be empty' });
  }

  if (destination.length < 3) {
    return res.status(400).jsend.fail({ message: 'destination must be at least 3 character long ' });
  }
  if (whitetext.test(destination)) {
    return res.status(400).jsend.fail({ message: 'destination can not have white spaces' });
  }

  if (!slot || slot === undefined || slot === null) {
    return res.status(400).jsend.fail({ message: 'slot parameter is required and must be a number' });
  }

  if (typeof slot !== 'number') {
    return res.status(400).jsend.fail({ message: 'slot must be a number' });
  }
  if (slot < 1 || slot > 30) {
    return res.status(400).jsend.fail({ message: 'slot must not be less than 1 or more than 30' });
  }

  if (!time || time === undefined || time === null) {
    return res.status(400).jsend.fail({ message: 'time  parameter is required' });
  }
  if (typeof time !== 'string') {
    return res.status(400).jsend.fail({ message: 'time must be a string' });
  }
  if (white.test(time)) {
    return res.status(400).jsend.fail({ message: 'time cannot be empty' });
  }

  if (!timeRegex.test(time)) {
    return res.status(400).jsend.fail({ message: 'Not a valid Time:=> valid time: HH:MM ' });
  }


  if (!carModel || carModel === undefined || carModel === null) {
    return res.status(400).jsend.fail({ message: 'car Model  parameter is required' });
  }
  if (typeof carModel !== 'string') {
    return res.status(400).jsend.fail({ message: 'car model must be a string' });
  }

  if (carModel.length < 3) {
    return res.status(400).jsend.fail({ message: 'Car Model must be at least 3 character long ' });
  }

  if (!takeOffDate || takeOffDate === undefined || takeOffDate === null) {
    return res.status(400).jsend.fail({ message: 'Take-off Date  parameter is required' });
  }
  if (typeof takeOffDate !== 'string') {
    return res.status(400).jsend.fail({ message: 'Take-off Date must be a string' });
  }
  if (white.test(takeOffDate)) {
    return res.status(400).jsend.fail({ message: 'Take-off Date cannot be empty' });
  }

  if (!dateRegex.test(takeOffDate)) {
    return res.status(400).jsend.fail({ message: 'Not a valid Date:=> valid Date: YYYY-MM-DD ' });
  }
  return next();
};
export default validateUser;
