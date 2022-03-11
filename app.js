const express = require('express');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const db = require('./data/database');

const playgroundRoutes = require('./routes/playground.routes');
const apiRoutes = require('./routes/api.routes');
const baseRoutes = require('./routes/base.routes');
const userRoutes = require('./routes/user.routes');
const reviewRoutes = require('./routes/review.routes')

const csrf = require('csurf');

const errorHandlerMiddleware = require('./middlewares/error-handler');
const notFoundMiddleware = require('./middlewares/not-found');

const expressSession = require('express-session');
const createSessionConfig = require('./config/session');

const ejsMate = require('ejs-mate');
const flash = require('connect-flash');

const passport = require('passport');

const app = express();

// Connect to db
db.on(
    'error',
    console.error.bind(console, 'Failed to connect to the database')
);
db.once('open', () => {
    console.log('Database connected');
});

// Config http request logger middleware
app.use(morgan('dev'));

// Passport config
require('./middlewares/passport')(passport);

// Activate EJS view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files (e.g. CSS files)

app.use(express.urlencoded({ extended: true })); // Extract (parses) incoming url request bodies
app.use(express.json()); // All incoming requests are now also checked for JSON data

// Create session
const sessionConfig = createSessionConfig();
app.use(expressSession(sessionConfig));

// Flash messages
app.use(flash());

// Passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

// Protection against CSRF attacks
app.use(csrf(), (req, res, next) => {
    res.locals.csrftoken = req.csrfToken();
    next();
});

// Global variables
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure');
    res.locals.errors = req.flash('error');
    next();
});

// Router handler
app.use('/api', apiRoutes);
app.use('/playgrounds', playgroundRoutes);
app.use('/', baseRoutes);
app.use('/', userRoutes);
app.use('/playgrounds/:id/reviews', reviewRoutes);

// Not found
app.use(notFoundMiddleware);

// Error handler
app.use(errorHandlerMiddleware);

// Port listening
const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
