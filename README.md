[![Build Status](https://travis-ci.org/chukwuemekachm/Maintenance-Tracker.svg?branch=develop)](https://travis-ci.org/chukwuemekachm/Maintenance-Tracker) [![Coverage Status](https://coveralls.io/repos/github/chukwuemekachm/Maintenance-Tracker/badge.svg?branch=ch-set-up-coveralls-157647477)](https://coveralls.io/github/chukwuemekachm/Maintenance-Tracker?branch=ch-set-up-coveralls-157647477) [![Test Coverage](https://api.codeclimate.com/v1/badges/d28cbe4f0bc7ae7669b5/test_coverage)](https://codeclimate.com/github/chukwuemekachm/Maintenance-Tracker/test_coverage) [![Maintainability](https://api.codeclimate.com/v1/badges/d28cbe4f0bc7ae7669b5/maintainability)](https://codeclimate.com/github/chukwuemekachm/Maintenance-Tracker/maintainability) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# Maintenance-Tracker
Maintenance Tracker App is an application that provides users with the ability to reach out to operations or repairs department regarding repair or maintenance requests and monitor the status of their request.

### Features

- Sign up to **_Maintenance Tracker_**
- Login to access features
- Update password
- Update profile
- Transactional Email notifications on requests(status)

#### User Features

- Make Request for repair or maintenance
- View all requests belonging to them
- View Details of a single request belonging to them
- Modify a pending request
- Delete a resolve or disapproved request

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
- Create a folder on your machine to house **_Maintenanace Tracker_** on your machine
- Create a local sql database with [Postgres](https://www.postgresql.org/download/) or an online database with [Elephant-sql](https://www.elephantsql.com/) or any other online Postgresql database provider.
- Obtain the database url of the database you created
- Start up command line and ``` cd ``` to the directory of the Folder you create for **_Maintenanace Tracker_**
- Run ``` git init ```  to initialize a local git repository
- Add the repo [link](https://github.com/chukwuemekachm/Maintenance-Tracker.git) above as the remote origin by running ``` git remote add origin <link> ```
- Run ``` git pull origin develop ```
- Add a ``` .env ``` file to project root. A sample of the ``` .env ``` can be found at the project root with the name ``` .env-sample ```
- Provide all the informaion needed in the ``` .env ``` as specified on the ``` .env-sample ```
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
