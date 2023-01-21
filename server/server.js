require('dotenv').config();
const express = require('express');
const flash = require('connect-flash');
const sanitizeHTML = require('sanitize-html');
const bodyParser = require('body-parser');
const compression = require('compression');

const router = require('./router');
const User = require('./models/model');
const { environment, whichPage } = require('./misc/helpers');
const app = express();
const errorHandlers = require('./misc/error-handlers');

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
app.use(require('./misc/global-variables')(app));
app.use('/contacts/:username', require('./misc/user-data')(app));
app.use('/', router);
app.use(errorHandlers);


module.exports = app;
