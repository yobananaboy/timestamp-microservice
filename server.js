// server.js

// init project
var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/:date', (req, res) => {
  // access time from time paramater
  var date = decodeURIComponent(req.params.date),
      unix = null,
      natural = null;
  
  // check if date is not an integer
  if(!Number.isInteger(+date)) {
    // check if data matches regex
    var regex = /(Jan\D*|Feb\D*|Mar\D*|Apr\D*|May\D*|Jun\D*|Jul\D*|Aug\D*|Sep\D*|Oct\D*|Nov\D*|Dec\D*)\s(\d\d?).+?(\d\d\d\d)/i;
    if(date.search(regex) > -1) {
      // if so, update natural time and get unix
      natural = date;
      var match = regex.exec(date);
      // match the three groups - first is month, second is date, third is year
      var month = getMonthFromString(match[1]),
          date = match[2],
          year = match[3];
      unix = new Date(year, month, date).getTime() / 1000;
    }
  } 
  // if data is an integer treat as unix, unless it is a silly date
  else if(Number.isInteger(+date) && date.length < 12) {
    unix = +date;
    // convert date from unix to string
    var dateFromUnix = new Date(unix * 1000),
      months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
      month = months[dateFromUnix.getMonth()],
      date = dateFromUnix.getDate(),
      year = dateFromUnix.getFullYear();
    natural = month + ' ' + date + ', ' + year;
  }
  var json = { 'unix': unix, 'natural': natural }
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(json));
}); 
  
app.get('*', (req, res, next) => {
  var err = new Error();
  err.status = 404;
  next(err);
});

// handling 404 errors
app.use(function(err, req, res, next) {
  if(err.status !== 404) {
    return next();
  }

  res.send(err.message || 'The date you entered must not have been unix or natural language. Please try again!');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

function getMonthFromString(mon){
   return new Date(Date.parse(mon + ' 1, 2017')).getMonth();
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
