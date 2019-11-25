var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var userModel = require("../../model/user.model");
const createError = require("http-errors");
router.get("/", async (req, res) => {
  let user = req.user;
  const message = req.session.message;
  req.session.message = null;
  if (req.query.id === undefined) {
    if (!user) return res.redirect("/login");
    res.render("passwordforgot/newPassword", {
      title: "Khôi phục mật khẩu",
      user,
      email: user.email,
      message
    });
  } else {
    const user = await userModel.verifyRecoverToken(req.query.id);
    if (user.length > 0) {
      const email = user[0].email;
      res.render("passwordforgot/newPassword", {
        title: "Khôi phục mật khẩu",
        email
      });
    } else {
      res.redirect("/forgotPassword");
    }
  }
});
router.post("/", async (req, res, next) => {
  const user = req.user;
  const body = req.body;
  if (req.body && req.body.email && req.body.password) {
    console.log("body", body);
    const password = bcrypt.hashSync(req.body.password, 10);
    await userModel.changePassword(req.body.email, password).catch(e => {
      next(e);
    });
    res.redirect("/login");
  } else {
    if (!user) return res.redirect("/login");
    userModel
      .findByEmail(user.email)
      .then(rows => {
        if (rows.length === 0) {
          return next(createError(404));
        }
        var ret = bcrypt.compareSync(body.old_password, rows[0].password);
        if (ret) {
          const password = bcrypt.hashSync(body.password, 10);
          userModel.changePassword(user.email, password).catch(e => next(e));
          return res.redirect("/login");
        }
        req.session.message = "Old password not vaild";
        res.redirect("/recoverPassword");
      })
      .catch(err => {
        return res.send(err, false);
      });
  }
});
module.exports = router;
