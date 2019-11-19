var express = require("express");
var router = express.Router();
var bcrypt = require("bcrypt");
var userModel = require("../../model/user.model");
router.get("/", async (req, res, next) => {
  var message = "Lỗi xác thực";
  let user = req.user;
  if (req.query.id === undefined) {
    res.render("passwordforgot/newPassword", {
      title: "Khôi phục mật khẩu",
      // message: message,
      user,
      email: user.email
    });
  } else {
    const user = await userModel.verifyRecoverToken(req.query.id);
    if (user.length > 0) {
      console.log("enter recoverpassword zone");
      // message = "";
      const email = user[0].email;
      res.render("passwordforgot/newPassword", {
        title: "Khôi phục mật khẩu",
        // message: message,
        email
      });
    } else {
      console.log("cannot enter recoverpassword zone");
      res.send(message);
    }
  }
});
router.post("/", async (req, res, next) => {
  console.log("abc", req.body);
  const user = req.user;
  const body = req.body;
  if (req.body && req.body.email && req.body.password) {
    //user[0].token = "";
      //userModel.update(user[0]);
    console.log("1");
    const password = bcrypt.hashSync(req.body.password, 10);
    await userModel.changePassword(req.body.email, password).catch(e => {
      console.log(e);
    });
    res.redirect("./login");
  } else {
    console.log("2");
    userModel
      .findByEmail(user.email)
      .then(rows => {
        if (rows.length === 0) {
          return res.send("loi form");
        }

        console.log("user--",body.old_password)
        // var user = rows[0];
        var ret = bcrypt.compareSync(body.old_password, rows[0].password);
        console.log("ret",ret);
        if (ret) {
          const password = bcrypt.hashSync(body.password, 10);
          userModel.changePassword(user.email, password).catch(e => {
            console.log(e);
            return res.send(e);
          });
          return res.redirect("./login");
        }

        return res.send("mat khau cu khong khop");
      })
      .catch(err => {
        return res.send(err, false);
      });
  }
});
module.exports = router;
