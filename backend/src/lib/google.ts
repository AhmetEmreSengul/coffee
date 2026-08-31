import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";
import { ENV } from "./env.js";

if (
  !ENV.GOOGLE_CLIENT_ID ||
  !ENV.GOOGLE_CLIENT_SECRET ||
  !ENV.GOOGLE_CALLBACK_URL
) {
  throw new Error(
    "GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_CALLBACK_URL must be set",
  );
}

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(
            new Error("Google account did not provide an email"),
            undefined,
          );
        }

        user = await User.findOne({ email });

        if (user) {
          user.googleId = profile.id;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          user.authProvider = "google";
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          googleId: profile.id,
          email,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value || "",
          authProvider: "google",
        });

        done(null, user);
      } catch (error) {
        done(error, undefined);
      }
    },
  ),
);

export default passport;
