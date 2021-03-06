const express 		= require('express');
const morgan 	    = require('morgan');
const bodyParser 	= require('body-parser');
const passport      = require('passport');
const pe            = require('parse-error');
const cors          = require('cors');
const expressValidator  = require('express-validator');
const logger = require('./services/logger.service');
const fs = require('fs');
const path = require('path');

const v1 = require('./routes/v1');

const app = express();

const CONFIG = require('./config/config');
const logDir = CONFIG.ACCESS_LOG_DIR ;

// if (!fs.existsSync(logDir)) {
//       fs.openSync(logDir);
//     }
// console.log(__dirname)
const accessLogStream = fs.createWriteStream(logDir, {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const models = require("./models");

// CORS
app.use(cors());

// console.log('hlo') ;

app.use(expressValidator({
    customValidators: {
        isValidMongoId: function(value) {
            var regex = /^[0-9a-f]{24}$/;
            return regex.test(value);
        },
        isValidEmail: function(value) {
            if (!value) return false;
            var value = value.trim();
            var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return email_regex.test(value);
        },
    }
}));


app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', v1);

app.get('/api', function(req, res){
	res.statusCode = 200;//send the appropriate status code
	res.json({status:"success", message:"Mongo API", data:{}})
});

// app.get('*', function(req, res) {
//     res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  logger.log(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,"info");

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

process.on('unhandledRejection', error => {
    console.error('Uncaught Error', pe(error));
});

module.exports = app;

