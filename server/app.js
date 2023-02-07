require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const compression = require('compression');
const router = require('./router');
const handleCSRFTokenError = require('./middlewares/handle-csrf-token-errors');
const globalVariables = require('./middlewares/global-variables');

const errorHandler = (error, req, res, next) => {
  console.error(error);
  const status = error.status || 500;
  const message = error.message || 'An error occurred';
  res.status(status).send(message);
};

const app = express();

require('./misc/passport-config');
require('./misc/session-config')(app);

app.set('views', 'view');
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(flash());
app.use(compression());
app.use('/favicon.ico', express.static('public/favicon.ico'));
app.use(globalVariables(app));
app.use('/', router);
app.use(handleCSRFTokenError);
app.use(errorHandler);


module.exports = app;
