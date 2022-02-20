const mongoose = require('mongoose');

const dbUrl =  'mongodb://127.0.0.1:27017/playgrounds';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

module.exports = db;