const { google } = require('googleapis');

module.exports.listEvents = function (auth, cb) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        cb(events)
        //   console.log(events);
        // console.log('Upcoming 10 events:');
        // events.map((event, i) => {
        //     cb({start: event.start.dateTime || event.start.date, event: event.summary})
        // //   const start = event.start.dateTime || event.start.date;
        // //   console.log(`${start} - ${event.summary}`);
        // // cb(items);
        // });
      } else {
        console.log('No upcoming events found.');
      }
    });
  }