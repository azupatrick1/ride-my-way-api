const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

exports.ridesDB = [
  {
    id: 1,
    name: 'ride1234',
    from: 'Abuja',
    to: 'Lagos',
    time: '7:00 pm',
  },
  {
    id: 2,
    name: 'ride1344',
    from: 'Lagos',
    to: 'Aba',
    time: '6:00 am',
  },
];

exports.requestDB = [{
  id: 1,
  rideId: 1,
  rideName: 'emeka',
  sender: 'john',
  status: 'sent',
}];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('we are live !!!'));

require('./api/v1/routes/ride.route.js')(app);

app.listen(port, () => {
  console.log('listening...');
});

module.exports = app;
