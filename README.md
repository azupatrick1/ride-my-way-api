[![npm version](https://badge.fury.io/js/node.svg)](https://badge.fury.io/js/node)  [![Build Status](https://travis-ci.org/jojitoon/ride-my-way-api.svg?branch=version1)](https://travis-ci.org/jojitoon/ride-my-way-api) [![Coverage Status](https://coveralls.io/repos/github/jojitoon/ride-my-way-api/badge.svg?branch=version1)](https://coveralls.io/github/jojitoon/ride-my-way-api?branch=version1) [![Maintainability](https://api.codeclimate.com/v1/badges/655570f8071f01f4a04b/maintainability)](https://codeclimate.com/github/jojitoon/ride-my-way-api/maintainability)

# Ride My Way Project

An example of RESTful API backed by [NodeJS](https://nodejs.org)/[Express](http://expressjs.com/)

Service allows to create and manipulate rides, send ride requests and also view them

By default API server will be started on this URL: http://localhost:3000/

You can view the deployed version on this URL : https://ride-my-way-api.herokuapp.com
 
See the API endpoints below.

# API Endpoints

##### GET api/v1/rides
Lists all rides.

##### GET api/v1/rides/:rideId
Shows a specific ride.

##### POST api/v1/rides
Creates a new ride

##### PUT api/v1/rides/:rideId
update a specific ride.

##### DELETE api/v1/rides/:rideId
delete a specific ride.

##### GET api/v1/rides/:rideId/request
Lists all ride requests under a specific ride.

##### POST api/v1/rides/:rideId/request
create a new ride request under a specific ride.


# Instructions
## Local development 
- clone repository with `git clone https://github.com/jojitoon/ride-my-way-api.git`
- `cd ride-my-way-api`
- run `npm install`
- run `npm start` 
- go to http://localhost:3000
- Hurray! you are live..

