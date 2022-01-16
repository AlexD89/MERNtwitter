import ExtractJwt  from 'passport-jwt/lib/extract_jwt.js';
import JwtStrategy from "passport-jwt/lib/strategy.js";
import mongoose from'mongoose';
import keys from "./keys.js";

const User = mongoose.model('User');

const options = {};
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = keys.secretOrKey;

export default passport => {
    passport.use(new JwtStrategy(options, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
            .then(user => {
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.log(err));
    }));
};