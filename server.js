// server.js

// init project
var express = require('express');
var app = express();
var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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
      var match = regex.exec(date);
      var numMonth = getMonthFromString(match[1]),
          date = match[2],
          year = match[3];
      // filter months to get month written in full for natural month
      var Naturalmonth = months.filter((month) => {
        return month.toLowerCase().substring(0, 3) === match[1].toLowerCase().substring(0, 3);
      }); 
      natural = Naturalmonth + ' ' + date + ', ' + year;
      // convert natural language to unix
      unix = Math.round(new Date(year, numMonth, date).getTime() / 1000);
    }
  } 
  // if data is an integer treat as unix
  else if(Number.isInteger(+date)) {
    unix = +date;
    // convert date from unix to string
    var dateFromUnix = new Date(unix * 1000),
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

  res.send(err.message || 'Please enter date in unix or natural language!');
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
