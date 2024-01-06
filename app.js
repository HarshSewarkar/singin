var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var passport = require("passport");
const expressSession = require("express-session");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const profileRouter = require("./routes/");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// ==============================================================================================================

//require express-session and passport
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: "saara saara",
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));

// ==============================================================================================================

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/profile", profileRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
