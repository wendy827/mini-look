const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require("../config/keys");
const User = require("../models/users")

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //通过配置信息来生成jwt的请求，验证这个token
opts.secretOrKey = keys.secretOrKey;


module.exports = function (passport) {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }

                return done(null, false);
            })
            .catch(err => {
                return done(err)
            });
    }));
}