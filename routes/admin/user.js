var express = require("express");
var router = express.Router();
const userModel = require("../../model/user.model");
const limitOfPerPage = require("../../const").limitOfPerPage;
// ---------------------------------------------------------------
router.get("/", async (req, res) => {
  let pageNumber = Number(req.query.page || 1);
  const getSizeOfTotal = await userModel.count();
  console.log(`getSizeOfTotal`, getSizeOfTotal);
  const sizeOfTotal = getSizeOfTotal[0]["count (*)"];
  const totalOfPage = Math.ceil(sizeOfTotal / limitOfPerPage);
  const pages = [];
  for (let i = 1; i <= totalOfPage; i++) {
    if (i === pageNumber)
      pages.push({
        id: i,
        currentPage: true
      });
    else
      pages.push({
        id: i,
        currentPage: false
      });
  }
  let page = (pageNumber - 1) * limitOfPerPage;
  let userList = await userModel.listInLimit(page, limitOfPerPage);
  console.log(`userList`, userList);
  userList = userList.map((value, index) => {
    value.index = page + index + 1;
    return value;
  });
  res.render("statistic/user", {
    title: "Express",
    user: req.user,
    pages,
    userList
  });
});
// ---------------------------------------------------------------
module.exports = router;
