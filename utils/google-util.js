const {google} = require('googleapis');

require('dotenv').config()

const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: 'http://localhost:3000/auth/success'
}

const defaultScope = [
    'https://www.googleapis.com/auth/drive.file',
    'profile',
    'email'
]

function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
      });
}

module.exports.urlGoogle = function() {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

module.exports.getGoogleAccountFromCode = async function(code) {
    const data = await auth.getToken(code);
    const tokens = data.tokens;
    const auth = createConnection();
    auth.setCredentials(tokens);
    const plus = getGooglePlusApi(auth);
    const me = await plus.people.get({ userId: 'me' });
    const userGoogleId = me.data.id;
    const userGoogleEmail = me.data.emails && me.data.emails.length && me.data.emails[0].value;
    return {
      id: userGoogleId,
      email: userGoogleEmail,
      tokens: tokens,
    };
  }
