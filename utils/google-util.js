const { google } = require('googleapis');

require('dotenv').config()

let oauth2Client;

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

function getOAuth2(auth) {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

module.exports.urlGoogle = function () {
    const auth = createConnection();
    // oauth2Client = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

module.exports.getGoogleAccountFromCode = async function (code, cb) {
    const auth = createConnection();
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const user = await getOAuth2(auth);
    user.userinfo.get((err, res) => {
        if (err) {
            cb(err);
        } else {
            const userProfile = {
                id: res.data.id,
                accessToken: tokens.access_token,
                name: res.data.name,
                displayPicture: res.data.picture,
                email: res.data.email
            }
            cb(null, userProfile);
        }
    })

}
