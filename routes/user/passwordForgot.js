var express = require("express");
var router = express.Router();
var userModel = require("../../model/user.model");
var bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const account = require("../../const/emailAccount");
const auth = require("../../middleware/auth");
/* GET emailForgot page. */
router.get("/", function(req, res) {
  const message = req.session.message;
  req.session.message = null;
  res.render("passwordforgot/passwordForgot", {
    title: "Email Forgot",
    message
  });
});

/* GET email requst notification page. */
router.get("/nortificationRequest", function(req, res) {
  res.render("passwordforgot/notificationRequest", {
    title: "Email Request Notification",
    layout: "../views/layout"
  });
});

/* GET input new password page. */
router.get("/newPassword", auth.user, function(req, res) {
  res.render("passwordforgot/newPassword", {
    title: "New Password",
    layout: "../views/layout",
    email: req.user.email
  });
});

router.post("/", async (req, res, next) => {
  const email = req.body.email;
  let token = "";
  let user = null;
  try {
    req.session.message =
      "Có vẻ như tài khoản của bạn không tồn tại, hoặc chưa được kíck hoạt với bất cứ email nào :( !!!";
    user = await userModel.findByEmail(email);
    if (user.length > 0) {
      token = await sendmailRecover(req, res, next, email);
      const entity = user[0];
      entity.token = token;
      return userModel
        .addRecoverToken(entity)
        .then(() => {
          req.session.message =
            "Chúng tôi đã gửi thư đến email của bạn, hãy làm theo hướng dẫn trong thư để lấy lại mật khẩu nhé ^^!";
          res.redirect("/forgotPassword/nortificationRequest");
        })
        .catch(e => next(e));
    }
    res.redirect("/forgotPassword");
  } catch (e) {
    next(e);
  }
});
const smtpTransport = nodemailer.createTransport({
  host: "gmail.com",
  service: "Gmail",
  auth: {
    user: account.GMAIL,
    pass: account.GMAIL_PASSWORD
  }
});

const sendmailRecover = async (req, res, next, email) => {
  const token = await bcrypt.hash(req.body.email, 0);
  const link = "http://" + req.get("host") + "/recoverPassword?id=" + token;
  const mailOptions = {
    to: email,
    subject: "Phục hồi tài khoản ABC VOICE",
    html:
      "Chào bạn!,<br> Hãy click vào đường dẫn bên dưới để phục hồi mật khẩu tài khoản ABC VOICE<br><a href=" +
      link +
      ">Click để phục hồi</a>"
  };
  // eslint-disable-next-line no-unused-vars
  smtpTransport.sendMail(mailOptions, function(error, info) {
    if (error) next(error);
  });
  return token;
};
module.exports = router;
