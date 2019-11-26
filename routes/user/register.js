var express = require("express");
var router = express.Router();
var userModel = require("../../model/user.model");
var keyModel = require("../../model/key.model");
var bcrypt = require("bcrypt");
router.get("/", function(req, res) {
  res.render("register/register", { title: "register" });
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.render("register/register", {
      title: "Đăng ký",
      message: "Missing parameters"
    });
  }
  console.log(req.body);
  const email_user = await userModel.findByEmail(email);
  console.log(email_user);
  if (email_user.length > 0) {
    return res.render("register/register", {
      title: "Đăng ký",
      message: "Username existed"
    });
  }
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
    await keyModel.add(freeKey);
    return res.redirect("/login");
  }
  return res.render("register/register", {
    title: "Đăng ký",
    message: "Register failed"
  });
});

module.exports = router;
