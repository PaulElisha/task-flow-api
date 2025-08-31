import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { User } from '../models/User.js';

import { config } from "dotenv";
config({ path: ".env" });

class AuthConfig {

    constructor() {
        this.jwtStrategy = this.jwtconfig();
        this.localSignupStrategy = this.localsignup();
        this.localLoginStrategy = this.locallogin();
    }

    jwtconfig() {
        return new JwtStrategy({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()

        }, async (token, done) => {
            try {
                return done(null, token.user);
            } catch (error) {
                return done(error, false);
            }
        });
    }

    localsignup() {
        return new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        }, async (req, email, password, done) => {
            try {
                const existingUser = await User.findOne({ email: req.body.email });
                if (existingUser) {
                    return done(null, { message: 'User already exists' });
                }
                const user = await User.create({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });
                return done(null, user);
            } catch (error) {
                console.error('Error during signup:', error);
                return done(error);
            }
        });
    }

    locallogin() {
        return new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, async (email, password, done) => {
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }
                const valid = await user.comparePassword(password);
                if (!valid) {
                    return done(null, false, { message: 'Invalid email or password' });
                }
                return done(null, user, { message: 'Logged in successfully' });
            } catch (error) {
                return done(error);
            }
        });
    }
}

const jwtStrategy = new AuthConfig().jwtStrategy;
const localSignupStrategy = new AuthConfig().localSignupStrategy;
const localLoginStrategy = new AuthConfig().localLoginStrategy;

const jwtconfig = {
    jwtStrategy,
    localSignupStrategy,
    localLoginStrategy
}

export { jwtconfig };