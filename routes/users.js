var express = require('express');
var router = express.Router();
var models = require('../models/index');
var bcrypt = require('bcrypt-nodejs');
var Puid = require('puid');
var jwt = require('jsonwebtoken');
var passport = require('passport');

var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

function findUser(username, callback) {
    try {
        models.Users.findOne({
            where: { username: username,}
        }).then(function(user) {
            if (user) {
                return callback(null, user);
            }
            return callback("user not found", null);
        });
    } catch (ex) {
        return callback(ex);
    }
}

// Creating new page
router.get('/signup', function(req, res, next) {
    res.render('signup', { title: 'Create Account' });
});

// Register new users
router.post('/signup', function(req, res) {
    if(!req.body.username || !req.body.email || !req.body.password) {
        res.json({ success: false, message: 'Please enter username, email and password.' });
    } else {
        findUser(req.body.username, function (err, user) {
            if(user){
                res.json({ success: false, message: 'Username already exists.' });
                return;
            }

            var user_token = jwt.sign({user: req.body.username}, config.jwtSecret, {
                expiresIn: '1d',
                algorithm: 'HS256'
            });

            console.log("adding new user with token: ", user_token);

            var puid = new Puid();
            var user_pid = puid.generate();

            models.Users.create({
                username: req.body.username,
                password: bcrypt.hashSync(req.body.password),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                birth_date: req.body.date_of_birth,
                email: req.body.email,
                token : user_token,
                pid : user_pid,
                type: 'USER'
            }).then(function (user) {
                res.json({ success: true, token: user.token });
            }).catch(function (err) {
                console.log("error in creating user ", err);
                res.json({ success: false, message: 'Error occurred while creating a user.' });
            });
        });
    }
});

// Authenticate the user and get a JSON Web Token to include in the header of future requests.
router.post('/login', function(req, res) {
    findUser(req.body.username, function (err, user) {
        if(!user){
            res.json({ success: false, message: 'User not found.' });
            return;
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.json({ success: false, message: 'Invalid password.' });
            return;
        }

        // invalid token - synchronous
        try {
            jwt.verify(user.token, config.jwtSecret);
            res.cookie('access_token', user.token, {secure: config.secure_cookie });
            res.redirect('/chat');
            //res.json({ success: true, token: user.token });
            return;
        } catch(err) {
            // err
            var user_token = jwt.sign({ user: req.body.username }, config.jwtSecret, {
                expiresIn: '1d',
                algorithm: 'HS256'
            });

            models.Users.update({
                'token': user_token
            }, {
                where: { username: user.username }
            }).then(function (user) {
                if(user) {
                    res.cookie('access_token', user.token, {secure: config.secure_cookie });
                    res.redirect('/chat');
                    //res.json({success: true, token: user_token});
                }
            }).catch(function (err) {
                console.log("Error while updating user ", err);
                res.json({ success: false, message: 'Error occurred while updating user info.' });
            });
        }
    });
});

// logout
router.get("/logout", passport.authenticate('jwt', { session: false }), function(req, res, next) {
    res.clearCookie("access_token");
    res.redirect('/');
});

/* list view */
router.all('/list', function(req, res) {

});

/* remove view */
router.all('/{id}/remove', function(req, res) {

});

/* update view */
router.all('/{id}/update', function(req, res) {

});

/* detail view */
router.all('/{id}', function(req, res) {

});

module.exports = router;
