var express = require("express");
var router = express.Router();
var passport = require("passport");
/* GET login page. */
router.get("/", function(req, res) {
  console.log("login");
  const info = req.session.info || "";
  req.session.info = null;
  res.render("login/login", { title: "Login", info });
});
router.post("/", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.session.info = info;
      return res.redirect("/login");
    }
    req.logIn(user, err => {
      if (err) return next(err);
      if (user.role === "admin") {
        res.redirect("admin/accessmanage");
        return;
      }
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
