var express = require("express");
var router = express.Router();
var userModel = require("../../model/user.model");
var keyModel = require("../../model/key.model");
var bcrypt = require("bcrypt");
router.get("/", function(req, res) {
  res.render("register/register", { title: "register" });
});

router.post("/", async (req, res) => {
  if (req.body) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.render("register/register", {
        title: "Đăng ký",
        message: "Missing parameters"
      });
    }
    const email_user = await userModel.findByEmail(email);
    if (email_user.length > 0) {
      return res.render("register/register", {
        title: "Đăng ký",
        message: "Username existed"
      });
    } else {
      const data = {
        email,
        password: bcrypt.hashSync(password, 10),
        role: "user",
        name: "NoName",
        isActivated: true
      };
      const useradd = await userModel.add(data);
      if (useradd.affectedRows === 1) {
        const freeKey = keyModel.createFreeKey(useradd.insertId);
        console.log(freeKey);
        await keyModel.add(freeKey);
        console.log("đăng ký thành công", useradd.insertId);
        return res.redirect("/login");
      } else {
        return res.render("register/register", {
          title: "Đăng ký",
          message: "Register failed"
        });
      }
    }
  } else {
    return res.render("register/register", {
      title: "Đăng ký",
      message: "Missing parameters"
    });
  }
});

module.exports = router;
