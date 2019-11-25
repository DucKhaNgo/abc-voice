var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const apiKeyModel = require("../../model/key.model");
// const packageModel = require("../../model/packageKey.model");
const toFunction = require("../../util/toFunction");
const genKey = require("../../function/genarateKey");
const moment = require("moment");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const user = req.user;
  const listKey = await toFunction(apiKeyModel.getKeyById(user.id));
  if (listKey[0]) {
    return next(listKey[0]);
  }
  listKey[1] = listKey[1].map(elem => {
    elem.date_expired = moment(elem.date_expired).format("DD/MM/YYYY");
    return elem;
  });
  res.render("userInfo/userInfo", {
    user,
    listKey: listKey[1]
  });
});
router.post("/updatekey", async (req, res) => {
  let key = await apiKeyModel.singleById(req.body.id);
  key[0].value = genKey();
  await apiKeyModel.update(key[0]);
  res.redirect("/profile");
});
router.post("/renewkey", async (req, res) => {
  let key = await apiKeyModel.singleById(req.body.idKey);
  key[0].date_expired = moment(key[0].date_expired)
    .add(key[0].term, "days")
    .format("YYYY-MM-DD");
  await apiKeyModel.update(key[0]);
  res.redirect("/profile");
});
router.post("/", async (req, res) => {
  const user = req.user;
  const name = req.body.name;
  if (name) {
    const newUser = Object.assign({}, user);
    newUser.name = name;
    user.name = name;
    userModel.update(newUser);
  }
  res.redirect("/profile");
});
// router.get('/', function(req, res, next) {
//   res.render('userInfo/userInfo', {title: "user info", user: req.user});
// });
module.exports = router;
