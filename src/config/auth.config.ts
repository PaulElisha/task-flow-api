/** @format */
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { AuthService } from "../services/auth.service.ts";

import { config } from "dotenv";
import { AuthServiceInstance } from "../types/services/services.types.ts";

config({ path: ".env" });

class AuthConfig {
  public authService: AuthServiceInstance;
  public localLoginStrategy: LocalStrategy;

  constructor() {
    this.authService = new AuthService();
    // this.googleStrategy = this.googleStrategy();
    this.localLoginStrategy = this.loginLocalStrategy();
  }

  // googleStrategy() {
  //   return new GoogleStrategy(
  //     {
  //       clientID: process.env.GOOGLE_CLIENT_ID,
  //       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //       callbackURL: process.env.GOOGLE_CALLBACK_URL,
  //       scope: ["profile", "email"],
  //       passReqToCallback: true,
  //     },
  //     async (req, accessToken, refreshToken, profile, done) => {
  //       try {
  //         const { email, sub: googleId, picture } = profile._json;
  //         console.log(profile, "profile");
  //         console.log(googleId, "googleId");
  //         if (!googleId) {
  //           throw new NotFoundException("Google ID (sub) is missing");
  //         }

  //         const { user } = await this.authService.googleLoginOrRegister({
  //           provider: ProviderEnum.GOOGLE,
  //           displayName: profile.displayName,
  //           providerId: googleId,
  //           picture: picture,
  //           email: email,
  //         });
  //         done(null, user);
  //       } catch (error) {
  //         done(error, false);
  //       }
  //     }
  //   );
  // }

  loginLocalStrategy() {
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
        } catch (error: any) {
          return done(error, false, { message: error?.message });
        }
      }
    );
  }
}

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null));

// const googleStrategy = new AuthConfig().googleStrategy;
const authconfig = new AuthConfig();

export { authconfig };
