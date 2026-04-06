import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import User from '../models/userSchema.js';

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    
    callbackURL: `${process.env.BACKEND_URL}/api/zorvyn-fintech/auth/google/callback`,
    proxy: true 
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });

      if (user) {
        if(!user.isVerified) user.isVerified = true;
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
        return done(null, user);
      } else {
        const newUser = await User.create({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          isVerified :  true
        });
        return done(null, newUser);
      }
    } catch (err) {
      return done(err, null);
    }
  }
));