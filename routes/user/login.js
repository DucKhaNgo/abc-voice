var express = require("express");
var router = express.Router();
var userModel = require("../../model/user.model");
var passport = require("passport");
let isInValid = false;
/* GET login page. */
router.get("/", function(req, res, next) {
  res.render("login/login", { title: "Login" });
});
router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.render("login/login", {
        title: "Login",
        info
      });
    }
    req.logIn(user, err => {
      if (err) return next(err);
      res.redirect("/");
    });
  })(req, res, next);
});
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    if (req.user && !req.user.password) {
      res.redirect("/forgotPassword/newPassword");
    } else res.redirect("/");
  }
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    if (req.user && !req.user.password) {
      res.redirect("/forgotPassword/newPassword");
    } else res.redirect("/");
  }
);
module.exports = router;
