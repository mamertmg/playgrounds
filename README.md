# Düsseldorf Playgrounds

## Techlabs Webdevelopment project

This branch contains the following aspects:

- EXPRESS setup
- Server initialization and listening in PORT 3000
- EJS Template engine setup and running
- Basic front-end with Bootstrap for testing purposes
- MongoDB connection to localhost
- Session creation and storage in MongoDB
- LOGIN / SIGNUP / LOGOUT with Passport authentication middleware
- CSRF Protection
- Route handler
- Error handler and not found middleware for status code 404 and 500
- Script for fetching and saving playground data in Düsseldorf in MongoDB
- Setup for querying playground database from client side with filters and displaying the result on a map.
- Users, Playgrounds, Events, Reviews and Ratings model
- Authorization middleware for routes protection
- CRUD for playground data
- Server-side validation for playground and event data
- Page to display information about a single playground now uses the datail page design from the detailPage branch.
- "Playgrounds" page now lists all playgrounds
- CRUD for Reviews
- Update of EJS views (you need to log in before vieweing/updating or deleting playgrounds, events, lost&found)
- Initiate profile user page

## New
- Small demo for event CRUD on the detailpage
- Implemented and/or improved CRUD for event and lost&found

## Usage

First install [Node.js](http://nodejs.org/) and [MongoDB](https://docs.mongodb.com/manual/installation/). Then download this repository and from its root execute the command

    $ npm install

to install all required node modules. Before starting the app, run

    $ npm run seed-playgrounds

to seed the database with the playground data. As a final step, run 

    $ npm run start

to start the server. Alternatively, you can run

    $ npm run dev

 to start the server with [Nodemon](https://www.npmjs.com/package/nodemon) for development. The web app can then be seen at [http://localhost:3000/](http://localhost:3000/).
