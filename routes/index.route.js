const express = require('express');
const { google } = require('googleapis');
const googleUtil = require('../utils/google-util');
const googleCalenderService =require('../services/google-calendar.service');

const router = express.Router();

// default landing route
router.get('/', (req, res) => {
    res.render('index.html', {'title': 'Application Home'});
});

// redirect to authentication uri
router.get('/login', (req, res) => {
    res.redirect(googleUtil.urlGoogle());
});

// middleware to check and save session cookie
const setCookie = async (req, res, next) => {
    googleUtil.getGoogleAccountFromCode(req.query.code, (err, res) => {
        if (err) {
            res.redirect('/login');
        } else {
            req.session.user = res;
        }
        next();
    });
}

// redirect uri
router.get('/auth/success',  setCookie, (req, res) => {
    res.redirect('/redirect');
})

// directing page
/* before landing to dashboard session cookie needs to be checked
 * but cookie will not save unless a view is rendered to the user
 * this will render a simple view to save cookie in the front end (browser)
 */
router.get('/redirect', (req, res) => {
    res.render('redirect.html');
});

// dashboard
router.get('/home', (req, res) => {
    
    // check for valid session
    if (req.session.user) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: req.session.user.accessToken
        });

        // get calendar events by passing oauth2 client
        googleCalenderService.listEvents(oauth2Client, (events) => {  
            console.log(events);
                      
            const data = {
                name: req.session.user.name,
                displayPicture: req.session.user.displayPicture,
                id: req.session.user.id,
                email: req.session.user.email,
                events: events
            }
            res.render('dashboard.html', data);
        });
        
    } else {
        res.redirect('/login')
    }
});

// delete session and logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            res.redirect('/home');
        }
        res.clearCookie('sid');
        res.redirect('/');
    });
})

module.exports = router;