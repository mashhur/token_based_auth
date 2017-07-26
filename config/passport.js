var JwtStrategy = require('passport-jwt').Strategy;
// var ExtractJwt = require('passport-jwt').ExtractJwt; // authorization through header
var model = require('../models/index');

var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies) token = req.cookies['access_token'];
    return token;
};

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
    var opts = {};
    //opts.jwtFromRequest = ExtractJwt.fromAuthHeader(); // authorization through header
    opts.jwtFromRequest = cookieExtractor;
    opts.secretOrKey = config.jwtSecret;
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log("Payload: ", jwt_payload);

        model.Users.findOne({
            where: { username: jwt_payload.user,}
        }).then(function(user) {
            if (user) {
                return done(null, user);
            }
            return done("user not found", null);
        });

    }));
};