# Maintenance-Tracker
[![Build Status](https://travis-ci.org/chukwuemekachm/Maintenance-Tracker.svg?branch=develop)](https://travis-ci.org/chukwuemekachm/Maintenance-Tracker) [![Coverage Status](https://coveralls.io/repos/github/chukwuemekachm/Maintenance-Tracker/badge.svg?branch=ch-set-up-coveralls-157647477)](https://coveralls.io/github/chukwuemekachm/Maintenance-Tracker?branch=ch-set-up-coveralls-157647477) [![Test Coverage](https://api.codeclimate.com/v1/badges/d28cbe4f0bc7ae7669b5/test_coverage)](https://codeclimate.com/github/chukwuemekachm/Maintenance-Tracker/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/d28cbe4f0bc7ae7669b5/maintainability)](https://codeclimate.com/github/chukwuemekachm/Maintenance-Tracker/maintainability) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

### Features

- Sign up to **_Maintenance Tracker_**
- Login to access features

#### User Features

- Make Request for repair or maintenance
- View all requests by them
- View Details of a single request
- Modify a pending request

#### Admin Features

- View all requests on the system
- Approve a request
- Disapprove a request
- Resolve a request

### Tools

##### _Dev Tools_

- HTML 
- CSS
- JAVASCRIPT(Node.js)

##### _Testing framework_

- Mocha
- Chai
- Chai-http

##### _Project Management_

- Pivotal Tracker

##### _Continous Integration_

- Travis ci
- Coveralls

### API Docs
- **[Apiary](https://maintenancetracker1.docs.apiary.io/#)**

### Getting Started

To setup **_Maintenanace Tracker_**, these should be installed on your machine

- [Node.js](https://nodejs.org/en/download/current/) 6 and above
- [Postman](https://www.getpostman.com/apps) Native or Postman [Chrome extension](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop?hl=en)
- [Postgres](https://www.postgresql.org/download/) Database or create an Online [Elephant sql](https://www.elephantsql.com/) database
- [Git](https://git-scm.com/downloads)

### Installation

To have a copy of Maintenance Tracker up and running on your local machine, follow these steps
- Copy the repo link https://github.com/chukwuemekachm/Maintenance-Tracker.git
- Create a folder on your machine
- Create a database
- Start up command line run ``` git init ```  to initialize a local git repository
- Add the repo [link](https://github.com/chukwuemekachm/Maintenance-Tracker.git) above as the remote origin by running ``` git remote add origin <link> ```
- Run ``` git pull origin develop ```
- Add a ``` .env ``` file to project root
- Add the DATABASE_URL to ``` .env ``` file
- Add a JWT_KEY to ``` .env ``` file
- Run ``` npm init ``` to initialize a Node app
- Run ``` npm install ``` to install app dependencies
- Run ``` npm migrate ``` to migrate database

Now you've successfully installed **_Maintenance Tracker_**

## Running the app

To run your newly installed **_Maintenanace Tracker_**
- Run ``` npm start ```

## Running automated tests
To run the automated tests that comes with your newly installed **_Maintenanace Tracker_**
- Run ``` npm test ```

## License

This project is authored by **Chima Chukwuemeka** ([chukwuemeka](https://github.com/chukwuemekachm)) and is licensed to use under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
