[![npm version](https://badge.fury.io/js/node.svg)](https://badge.fury.io/js/node)  [![Build Status](https://travis-ci.org/jojitoon/ride-my-way-api.svg?branch=develop)](https://travis-ci.org/jojitoon/ride-my-way-api) [![Coverage Status](https://coveralls.io/repos/github/jojitoon/ride-my-way-api/badge.svg?branch=develop)](https://coveralls.io/github/jojitoon/ride-my-way-api?branch=develop) [![Maintainability](https://api.codeclimate.com/v1/badges/655570f8071f01f4a04b/maintainability)](https://codeclimate.com/github/jojitoon/ride-my-way-api/maintainability)

# Ride My Way Project

A Full-Stack web application built for users to share their amazing and exciting rides they want to share with other and get exciting request from amazing people 
By default API server will be started on this URL: http://localhost:3000/

You can view the deployed version on this URL : https://ride-my-way-api.herokuapp.com
 

# Technologies
* [NodeJS](https://nodejs.org)
* [Postgresql](https://www.postgresql.org/)
* [Express](http://expressjs.com/)

# Documentation
The full documentation will be released soon.


# Functionalities

## New Users
* Create an account
* Sign in as a user

## Registered Users
* View profile
* View all ride offers
* Create New ride offer
* View a specific ride offer
* Cancel a ride offer
* Make a request to a ride offer
* View request to a ride offer
* Reject a request to a ride offer
* Accept a request to a ride offer



# API Endpoints
Attach endpoints to `localhost:3000` or `ride-my-way-api.herokuapp.com`

### POST /api/v1/auth/signup
sign up as a user

req:
```
{
	"username":"username",
	"email":"email@gmail.com",
	"password": "password"
}	 
```

res:
```
{
    "status": "success",
    "data": {
        "message": "user is signed up successfully",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0OGNjYjEzLTRlOWEtNDdiMy04MDM3LWYwYmQwNGVlZTBkOCIsImlhdCI6MTUzMDg1MzI1MywiZXhwIjoxNTMwOTM5NjUzfQ.GGv19oVH25SjaP_o7eIGCyC3bLPQgly29CxOuNuUKGg"
    }
}
```

### POST /api/v1/auth/signin
sign in as a user

req:
```json
{
	"email":"email@gmail.com",
	"password": "password"
}	 
```

res:
```json
{
    "status": "success",
    "data": {
        "message": "user is signed in successfully",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM"
    }
}
```
### GET /api/v1/auth/profile
view profile as a user

req:

set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```
res:
```json
{
    "status": "success",
    "data": {
        "user": {
            "id": "1585e9b8-5d84-40b7-b8e0-8b792036e4a1",
            "username": "jojitoon",
            "password": "$2b$10$UUh2lhFLFs04j15G0khLxOPkiRDerNEOufaBwoZa/mEfqfhco.4WC",
            "email": "jojicartoon@gmail.com",
            "created_at": "2018-07-06T01:34:41.879Z"
        }
    }
}
```

### GET api/v1/rides
Lists all rides.

req:

set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```

res:
```
{
    "status": "success",
    "data": {
        "rides": [
            {
                "id": 1,
                "name": "jojitoon124",
                "location": "ijebu",
                "destination": "fred",
                "slot": 3,
                "time": "12:30:00",
                "user_id": "1585e9b8-5d84-40b7-b8e0-8b792036e4a1",
                "status": "cancelled",
                "riders": [],
                "created_at": "2018-07-06T01:35:12.512Z",
                "updated_at": null
            },
            {
                "id": 2,
                "name": "jojitoon124",
                "location": "ijebu",
                "destination": "fred",
                "slot": 3,
                "time": "12:20:00",
                "user_id": "1585e9b8-5d84-40b7-b8e0-8b792036e4a1",
                "status": "cancelled",
                "riders": [],
                "created_at": "2018-07-06T01:36:32.939Z",
                "updated_at": null
            }
        ]
    }
}
```

### GET api/v1/rides/:rideId
Shows a specific ride.

req:

set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```

res:
```
{
    "status": "success",
    "data": {
        "ride": {
            "id": 1,
            "name": "jojitoon124",
            "location": "ijebu",
            "destination": "fred",
            "slot": 3,
            "time": "12:30:00",
            "user_id": "1585e9b8-5d84-40b7-b8e0-8b792036e4a1",
            "status": "cancelled",
            "riders": [],
            "created_at": "2018-07-06T01:35:12.512Z",
            "updated_at": null
        }
    }
}
```

### POST api/v1/users/rides
Creates a new ride

req:
set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```
send a body:
```json
{
"name":"jojitoon124",
"location":"ijebu",
"destination":"fred",
"slot":3,
"time":"12:50"
	
}	 
```

res:
```json
{
    "status": "success",
    "data": {
        "ride": {
            "id": 8,
            "name": "jojitoon124",
            "location": "ijebu",
            "destination": "fred",
            "slot": 3,
            "time": "12:50:00",
            "user_id": "1585e9b8-5d84-40b7-b8e0-8b792036e4a1",
            "status": "pending",
            "riders": [],
            "created_at": "2018-07-06T05:16:13.361Z",
            "updated_at": null
        }
    }
}
```


### DELETE api/v1/rides/:rideId
Cancel a specific ride.

req:

set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```

res:
```json
{
    "status": "success",
    "data": {
        "message": "The ride has been cancelled"
    }
}
```

### GET api/v1/rides/:rideId/requests
Lists all ride requests under a specific ride.


req:

set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```

res:
```json
{
    "status": "success",
    "data": {
        "requests": [
            {
                "id": 1,
                "rider": "username",
                "status": "pending request",
                "user_id": "848ccb13-4e9a-47b3-8037-f0bd04eee0d8",
                "ride_id": 8,
                "created_at": "2018-07-06T05:20:16.011Z",
                "updated_at": null
            },
            {
                "id": 1,
                "rider": "username",
                "status": "pending request",
                "user_id": "848ccb13-4e9a-47b3-8037-f0bd04eee0d8",
                "ride_id": 8,
                "created_at": "2018-07-06T05:20:16.011Z",
                "updated_at": null
            }
        ]
    }
}
```

### POST api/v1/rides/:rideId/requests
create a new ride request under a specific ride.


req:

set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```

res:
```json
{
    "status": "success",
    "data": {
        "request": {
            "id": 1,
            "rider": "username",
            "status": "pending request",
            "user_id": "848ccb13-4e9a-47b3-8037-f0bd04eee0d8",
            "ride_id": 8,
            "created_at": "2018-07-06T05:20:16.011Z",
            "updated_at": null
        }
    }
}
```

### PUT api/v1/rides/:rideId/requests/:requestId
accept or reject a ride request under a specific ride.

req:
set headers to `x-token-access` to token acquired.

eg:
```
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE1ODVlOWI4LTVkODQtNDBiNy1iOGUwLThiNzkyMDM2ZTRhMSIsImlhdCI6MTUzMDg1MzUwOSwiZXhwIjoxNTMwOTM5OTA5fQ.pt9vOnulxxzOGJSgroAMVj_JsgFfBeltpFTBZBtwaEM
```
send a body:
```json
{
	"accept": true
} 
```
or
```json
{
	"accept": false
}
```


res:
```json
{
    "status": "success",
    "data": {
        "message": "you have accepted this request"
    }
}
```
or
```json
{
    "status": "success",
    "data": {
        "message": "you have rejected this request"
    }
}
```

# Instructions
## Testing endpoints
Use postman to test API endpoints

## Local development 
- clone repository with `git clone https://github.com/jojitoon/ride-my-way-api.git`
- `cd ride-my-way-api`
- run `npm install`
- run `npm start` 
- go to http://localhost:3000
- Hurray! you are live..

# 

## contributions to the project 
* Fork this repository to your github account
* Clone the repository - git clone https://github.com/{your_username_goes_here}/ride-my-way-api.git
* Create your feature branch - git checkout -b {feature, chore or bug}-short_feature_description
* Commit your changes - git commit -m “{commit_message_goes_here}“ or git commit for the interactive interface
* Push to the remote branch - git push origin {your_branch_name_as_described_above}
* Open a pull request

## Author
Orji Ikechukwu (Jojitoon)

## License 
This is licensed for your use, modification and distribution under the [MIT license.](https://opensource.org/licenses/MIT)
