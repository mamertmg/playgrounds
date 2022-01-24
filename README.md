# playgrounds - Map Demo (WIP)
Techlabs Webdevelopment project

## Overview
This very basic demo ExpressJS app which is build around the version of the landingpage mockup in the **idea_8bitlook** branch as of [this commit](https://github.com/mamertmg/playgrounds/commit/0f8f0540654452ea0aec8d720b3957a392d7381c). A rough summary of the showcased features:
- fetching data about playgrounds in Düsseldorf [(source)](https://opendata.duesseldorf.de/dataset/notfallnummern-auf-st%C3%A4dtischen-spielpl%C3%A4tzen) and saving it to a local MongoDB database;
- querying the playground database (with filters) and displaying the result on a map / the website.

## Usage
First install [Node.js](http://nodejs.org/) and [MongoDB](https://www.mongodb.org/downloads). Then download this repository and from its root execute the command

    $ npm install

to install all required node modules. Before starting the app, run

    $ node data/seedDB.js

to seed the database with the playground data. As a final step, run 

    $ node index.js

to start the server. The web app can then be seen via [http://localhost:3000/](http://localhost:3000/).

## Used tools
### Node modules
- [Axios](https://axios-http.com/)
- [EJS](https://ejs.co/)
- [Express](https://expressjs.com/)
- [method-override](https://github.com/expressjs/method-override#readme)
- [mongoose](https://mongoosejs.com/)
### Others
- [Google Maps Javascript API](https://developers.google.com/maps/) for displaying maps.
- [Nominatim](https://nominatim.org/) for geocoding.

## Todo
- [ ] Validators for DB queries.
- [ ] InfoWindows close when you click on map.
- [ ] Error handling.