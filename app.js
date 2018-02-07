const express = require('express');
const bodyParser = require('body-parser');
//agregar para mongo
const mongoose = require('mongoose');
const app = express();

const session =require('express-session');

const MongoStore = require('connect-mongo') (session);

//mongodb connection
mongoose.connect("mongodb://localhost:27017/bookworm");
const db = mongoose.connection;

//mongo error
db.on('error', () => {console.error('connection error:')});

//use session for tracking logins
app.use(session({
  secret:'Lab web',
  resave:true,  //se vuelva a guardar la sesión
  saveUninitialized: false, //nueva y no está modifiada
  store: new MongoStore( {
    url:"mongodb://localhost:27017/bookworm"
  })
}));

// make user ID available in templates
app.use((req, res,next) => {
  res.locals.currentUser = req.session.userId
  next()
})
// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// serve static files from /public
app.use(express.static(`${__dirname}/public`));

// view engine setup
app.set('view engine', 'pug');
app.set('views', `${__dirname}/views`);

// include routes
const routes = require('./routes/index');
app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use( (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000,  () => {
  console.log('Express app listening on port 3000');
});
