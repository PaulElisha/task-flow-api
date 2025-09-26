/** @format */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import { AuthService } from "../services/AuthService.js";

import { config } from "dotenv";
config({ path: ".env" });

class AuthConfig {
  constructor() {
    this.authService = new AuthService();
    this.googleStrategy = this.googleStrategy();
    this.localLoginStrategy = this.locallogin();
  }

  googleStrategy() {
    return new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const { email, sub: googleId, picture } = profile._json;
          console.log(profile, "profile");
          console.log(googleId, "googleId");
          if (!googleId) {
            throw new NotFoundException("Google ID (sub) is missing");
          }

          const { user } = await this.authService.googleLoginOrRegister({
            provider: ProviderEnum.GOOGLE,
            displayName: profile.displayName,
            providerId: googleId,
            picture: picture,
            email: email,
          });
          done(null, user);
        } catch (error) {
          done(error, false);
        }
      }
    );
  }

  localLoginStrategy() {
    return new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        session: true,
      },
      async (email, password, done) => {
        try {
          const user = await this.authService.localLogin({ email, password });
          return done(null, user);
        } catch (error) {
          return done(error, false, { message: error?.message });
        }
      }
    );
  }
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const googleStrategy = new AuthConfig().googleStrategy;
const localLoginStrategy = new AuthConfig().localLoginStrategy;

export { googleStrategy, localLoginStrategy };
