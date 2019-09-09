const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');

require('dotenv').config()

passport.serializeUser((user, done) => {
    const session = {
        id: user.gooogleID,
        token: user.accessToken,
        name: user.name,
        displayPicture: user.url,
        email: user.email
    }
    done(null, session);
});


passport.deserializeUser((sessionUser, done) => {
    done(null, sessionUser)
});

passport.use(
    new googleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/auth/success'
        },
        (accessToken, refreshToken, profile, done) => {
            const session = {
                token: accessToken,
                name: profile.displayName,
                displayPicture: profile._json.picture,
                email: profile._json.email
            }

            done(null, session);
        }
    )
);

module.exports = passport;