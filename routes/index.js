var express = require('express');
var passport = require('passport');
var router = express.Router();
var jwt = require('jwt-simple');

require('../config/passport')(passport);

router.get('/', function(req, res, next) {
    if(req.cookies['access_token']) {
        res.redirect('/chat');
        return;
    }
    res.render('login', { title: 'Token Based Authorization', message: '' });
});

router.get("/chat", passport.authenticate('jwt', { session: false }), function(req, res) {
    res.render("chat");
});

module.exports = router;
