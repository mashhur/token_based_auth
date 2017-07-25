var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var model = require('../models/index');

var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];

// Setup work and export for the JWT passport strategy
module.exports = function(passport) {
    var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
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