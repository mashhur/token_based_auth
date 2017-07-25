var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jwt-simple');

require('../config/passport')(passport);

router.get('/', function(req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/welcome');
        return;
    }
    res.render('login', { title: 'Token Based Authorization', message: '' });
});

router.post("/welcome", passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json("Success! You can not see this without a token");
});

module.exports = router;
