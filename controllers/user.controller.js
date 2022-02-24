const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Get Login Page
function getLogin (req, res) {
    res.render('user/login');
};

// Get Signup Page
function getSignup (req, res) {
    res.render('user/signup');
};

// Get Profile Page
function getProfile(req,res){
    res.render('user/profile')
}

// Sign up
function signup (req,res) {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // Check required fields  
    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }
    
    // Check passwords match
    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }
    
    if (errors.length > 0) {
        res.render('user/signup', {
          errors,
          name,
          email,
          password,
          password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email }).then(user => {
            if (user) {
                // User exists
                errors.push({ msg: 'Email already exists' });
                res.render('user/signup', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        // Save user
                        newUser
                        .save()
                        .then(user => {
                            req.flash(
                                'success',
                                'You are now registered and can log in'
                            );
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                    });
                });
            }
        });
    }
};

// Login
function login(req, res, next) {
    passport.authenticate('local', {
        successFlash: true,
        failureFlash: true,
        successFlash: 'Welcome back to Düsseldorf Playgrounds!',
        failureFlash: 'Invalid username or password.',
        successRedirect: '/playgrounds',
        failureRedirect: '/login'
    })(req, res, next);
};
  
// Logout
function logout (req, res) {
    req.logout(); 
    req.flash('success', 'You are logged out. Come back soon!!'); 
    res.redirect('/login');
};

module.exports = {
    getLogin:  getLogin,
    getSignup: getSignup,
    signup: signup,
    login: login,
    logout: logout,
    getProfile: getProfile
};