const mongoDbStore = require('connect-mongodb-session');
const expressSession = require('express-session');

// Creating session storage in MongoDB database
function createSessionStore(){
    const MongoDBStore = mongoDbStore(expressSession);
    
    const store = new MongoDBStore({
        uri: 'mongodb://localhost:27017',
        databaseName: 'playgrounds',
        collection: 'sessions'
    })

    return store;
};

// Creating session configuration
function createSessionConfig(){
    return {
        secret: 'super-secret',
        resave: false,
        saveUninitialized: false,
        store: createSessionStore(),
        cookie: {
            maxAge: 2 * 24 * 60 * 60 * 1000
        }
    }
};

module.exports = createSessionConfig;
