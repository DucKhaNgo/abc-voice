/* GET home page. */
var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  console.log(req.user);
  res.render("packageManage/packageManage", {
    title: "Express",
    user: req.user
  });
});
module.exports = router;
