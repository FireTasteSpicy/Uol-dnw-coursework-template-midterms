# Blogging Tool Setup Instructions #
## Installation Requirements ##
### NodeJS ###
* Follow the install instructions at [NodeJS](https://nodejs.org/en/)
* It is recommended to use the latest LTS version

### Sqlite3 ###
* Follow the instructions at [SQLite Installation](https://www.tutorialspoint.com/sqlite/sqlite_installation.htm)
* Note that the latest versions of macOS and Linux come with SQLite pre-installed

## Setup Instructions ##
### Install Node Packages ###
* Run `npm install` from the project directory to install all the necessary node packages

### Create the Database ###
* On macOS or Linux, run `npm run build-db`
* On Windows, run npm run `build-db-win`

### Start the Web App ###
* Run `npm run start` to start serving the web app
* Access the web app via http://localhost:3000

### Rebuilding the Database (if needed) ###
To delete the database and start fresh:
* On macOS or Linux, run `npm run clean-db`
* On Windows, run `npm run clean-db-win`

# Additional Libraries Used #
## Frontend ##
* Bootstrap: Front-end framework for developing responsive and mobile-first websites

## Backend ##
* express-validator: A set of express.js middlewares that wraps validator.js validator and sanitizer functions
* express-session: Simple session middleware for Express
* helmet: Helps secure Express apps by setting various HTTP headers
* cors: Provides Express middleware to enable CORS
* express-rate-limit: Basic rate-limiting middleware for Express
* compression: Node.js compression middleware
