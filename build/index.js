'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var port = process.env.PORT || 3000;

exports.ridesDB = [{
  id: 1,
  name: 'ride1234',
  from: 'Abuja',
  to: 'Lagos',
  driver: 'driver 1',
  time: '7:00 pm'
}, {
  id: 2,
  name: 'ride1344',
  from: 'Lagos',
  to: 'Aba',
  driver: 'driver 2',
  time: '6:00 am'
}];

exports.requestDB = [{
  id: 1,
  rideId: 1,
  rideName: 'emeka',
  sender: 'john',
  status: 'sent'
}];

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  return res.send('we are live !!!');
});

require('./api/v1/routes/ride.route.js')(app);
require('./api/v1/routes/rideRequest.route.js')(app);

var server = app.listen(port, function () {
  console.log('listening on port ' + port + ' ...');
});

var stop = function stop() {
  server.close();
};
module.exports = app;
module.exports.stop = stop;
//# sourceMappingURL=index.js.map