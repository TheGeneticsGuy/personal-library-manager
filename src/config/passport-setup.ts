import passport from 'passport';
import {
  Strategy as GoogleStrategy,
  Profile,
  VerifyCallback,
} from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!, // /auth/google/callback
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      // profile contains certain user info from Google, like profile pic - Maybe use this picture automatically?
      console.log('Google Profile:', profile); // Using this to see all the profile details to learn/debugg
      console.log('Google Profile ID:', profile.id); // <--- So I can see Oauth ID for seed database of test file

      const googleEmail = profile.emails && profile.emails[0].value; // Assuming first email is primary and verified

      if (!googleEmail) {
        return done(new Error('No email found from Google profile'), undefined);
      }

      try {
        // Ok, this is to find the user by Google ID
        let user = await User.findOne({
          oauthId: profile.id,
          oauthProvider: 'google',
        });

        if (user) {
          // Maybe update the profile here if they have logged in before and Google details have changed? (Like pic)
          // Ex:
          // user.displayName = profile.displayName;
          // user.profilePictureUrl = profile.photos && profile.photos[0].value;
          // await user.save();
          return done(null, user);
        } else {
          // Ok, new user!
          const newUser = new User({
            oauthId: profile.id,
            oauthProvider: 'google',
            displayName: profile.displayName,
            email: googleEmail,
            firstName: profile.name?.givenName,
            lastName: profile.name?.familyName,
            profilePictureUrl: profile.photos && profile.photos[0].value,
            readingGoal: 0, // Hrmm... I guess I'll set default reading goal of books to zero.
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err as Error, undefined);
      }
    }
  )
);

// So the user is the "user object" from the mongo DB
passport.serializeUser((user: any, done) => {
  done(null, user.id); // user.id is referencing MongoDB's _id
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err as Error, null);
  }
});

export default passport;
