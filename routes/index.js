var express = require("express");
var router = express.Router();
var passport = require("passport");
var GoogleStrategy = require("passport-google-oidc");
require("dotenv").config();
const User = require("./users");
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
      callbackURL: "/oauth2/redirect/google",
      scope: ["profile", "email"],
    },
    async function verify(issuer, profile, cb) {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          // If the user already exists, return the existing user
          return cb(null, user);
        }

        // If the user doesn't exist, create a new user
        let newUser = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          // Optionally, set the profile picture if available
          profilePicture: profile.photos && profile.photos[0].value,
        });

        // Return the newly created user object
        return cb(null, newUser);
      } catch (err) {
        console.error(err);
        return cb(err);
      }
    }
  )
);

router.get("/", function (req, res, next) {
  res.render("index");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
  "/oauth2/redirect/google",
  passport.authenticate("google", {
    successRedirect: "/profile",
    failureRedirect: "/login",
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

router.get("/profile", isAuthenticated, function (req, res) {
  res.render("profile", { user: req.user });
});

module.exports = router;
