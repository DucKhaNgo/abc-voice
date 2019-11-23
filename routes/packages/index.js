var express = require("express");
var router = express.Router();
var packageKeyModel = require("../../model/packageKey.model");
var keyModel = require("../../model/key.model");
var toFunc = require("../../util/toFunction");
var bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const account = require("../../const/emailAccount");
let message = false;
/* GET home page. */

router.get("/", async function(req, res) {
  console.log(req.user);
  const listKey = await toFunc(packageKeyModel.getAll());
  console.log("listKey", listKey[1][0]);
  res.render("packages/packages", {
    title: "Express",
    user: req.user,
    listKey: listKey[0] === null ? listKey[1] : "error",
    message: message
  });
  message = false;
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
        message = `Code's sent to your email ${user.email} . Please check !`;
        res.redirect("/packages");
      }
    }
  }
});
router.get("/verify", function(req, res) {
  console.log(req.user);
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }

  res.render("checkcode/checkcode", {
    title: "Verify OTP",
    user,
    message
  });
  message = false;
});
router.post("/verify", async (req, res, next) => {
  console.log(req.user);
  const user = req.user;
  if (!user) {
    return res.redirect("/login");
  }
  const code = req.body.code;
  console.log("code---", code);
  const api_key = await toFunc(keyModel.getKeyByTransactionId(code));
  if (api_key[0]) {
    next(api_key[0]);
  } else {
    if (api_key[1].length === 0) {
      message = "OTP code is invalid please try again :( !";
      console.log("messs---", message);
    } else {
      console.log("valid---", api_key[1][0]);
      api_key[1][0].valid = true;

      // const result = await toFunc(keyModel.update(api_key[1][0]));
      // if (result[0]) {
      //   next(result[0]);
      // } else {
      keyModel.update(api_key[1][0]);
      console.log("valid---", api_key[1][0]);
      message = "Your key is activated successfully !!!";
      //res.redirect("/");
      //}
    }
    res.redirect("/packages/verify");
  }
});
module.exports = router;
