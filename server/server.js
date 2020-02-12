const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const flash = require("connect-flash");
const server = express();
const bodyParser = require("body-parser");
const router = require("./router");
const compression = require("compression");
const User = require("./models/model")

let sessionOptions = session({
  secret: "Mental Model Programming",
  store: new MongoStore({ client: require("../db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
});



server.set("views", "view");
server.set("view engine", "ejs");

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static("public"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(sessionOptions);
server.use(flash());
server.use(compression());
server.use('/favicon.ico', express.static('public/favicon.ico'));
server.use((req, res, next) => {
  // Make all available from all templates
  res.locals.errors = req.flash("errors");
  res.locals.success = req.flash("success");
  res.locals.user = req.session.user;
  
  next();
});
server.use("/profile/:email", (req, res, next)=>{
  User.findByEmail(req.params.email).then((userDoc)=>{
      userDoc.url = "https://www.gssgcontactbook.com" + req.originalUrl
      res.locals.seo = userDoc
  }).catch((err)=>{
      console.log(err);
  });
  next()
})


server.use(router);

module.exports = server;
