var express = require("express");
var router = express.Router();
var packageKeyModel = require("../../model/packageKey.model");
var keyModel = require("../../model/key.model");
var toFunc = require("../../util/toFunction");
var bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const account = require("../../const/emailAccount");
/* GET home page. */

router.get("/", async function(req, res) {
  const listKey = await toFunc(packageKeyModel.getAll());
  const message = req.session.message;
  req.session.message = null;
  res.render("packages/packages", {
    title: "Express",
    user: req.user,
    listKey: listKey[0] === null ? listKey[1] : "error",
    message
  });
});
const smtpTransport = nodemailer.createTransport({
  host: "gmail.com",
  service: "Gmail",
  auth: {
    user: account.GMAIL,
    pass: account.GMAIL_PASSWORD
  }
});
const sendOTPToMail = (req, res, email, OTP) => {
  const link = "http://" + req.get("host") + "/packages/verify";
  const mailOptions = {
    to: email,
    subject: "XÁC NHẬN THANH TOÁN PACKAGE API ABC VOICE",
    html:
      "Chào bạn!,<br> Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi, hãy click vào đường dẫn bên dưới để hoàn tất quá trình thanh toán package ABC VOICE<br><br>Đây là mã code của bạn: " +
      OTP +
      "<br><a href=" +
      link +
      ">Click để xác nhận </a>"
  };
  console.log(mailOptions);
  return smtpTransport.sendMail(mailOptions, (error, response) => {
    if (error) {
      console.log(error);
      return error;
    } else {
      console.log("Message sent: " + response.message);
      return null;
    }
  });
};
router.get("/buy/:id", async (req, res, next) => {
  const user = req.user;
  const idPackage = req.params.id;
  if (!user) {
    res.redirect("/login");
  }
  const token = bcrypt.hashSync(user.email, 0);
  const OTP = `G${idPackage}-${token}`;
  const packages = await toFunc(packageKeyModel.findOne(idPackage));
  if (packages[0]) {
    next(packages[0]);
  } else {
    const entity = keyModel.createEntity(packages[1][0], user.id, OTP);
    const result = await toFunc(keyModel.add(entity));
    if (result[0]) {
      next(result[0]);
    } else {
      const isErr = sendOTPToMail(req, res, user.email, OTP);
      if (isErr) {
        next(isErr);
      } else {
        // eslint-disable-next-line require-atomic-updates
        req.session.message = `Code's sent to your email ${user.email} . Please check !`;
        res.redirect("/packages");
      }
    }
  }
});
router.get("/verify", function(req, res) {
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  const message = req.session.message;
  req.session.message = null;
  res.render("checkcode/checkcode", {
    title: "Verify OTP",
    user,
    message
  });
});
router.post("/verify", async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  let message = null;
  const code = req.body.code;
  const api_key = await toFunc(keyModel.getKeyByTransactionId(code));
  if (api_key[0]) {
    return next(api_key[0]);
  }
  if (api_key[1].length === 0) {
    message = "OTP code is invalid please try again :( !";
  } else {
    api_key[1][0].valid = true;
    api_key[1][0].transactionId = null;
    keyModel.update(api_key[1][0]);
    message = "Your key is activated successfully !!!";
  }
  // eslint-disable-next-line require-atomic-updates
  req.session.message = message;
  res.redirect("/packages/verify");
});
module.exports = router;
