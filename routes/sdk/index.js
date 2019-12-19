var express = require("express");
var router = express.Router();

router.get("/", function(req, res) {
  res.render("sdk/sdk", { title: "Express", user: req.user });
});

module.exports = router;
