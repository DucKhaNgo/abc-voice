const express = require("express");
const router = express.Router();
const apiKeyModel = require("../../model/key.model");
// const packageModel = require("../../model/packageKey.model");
const toFunction = require("../../util/toFunction");
const limitOfPerPage = require("../../const").limitOfPerPage;
const moment = require("moment");
const genKey = require("../../function/genarateKey");
// ---------------------------------------------------------------

// ---------------------------------------------------------------
router.get("/:id", async (req, res, next) => {
  const idUser = req.params.id;
  const pageNumber = Number(req.query.page || 1);
  const getSizeOfTotal = await apiKeyModel.countOderByUserId(idUser);
  const sizeOfTotal = getSizeOfTotal[0].count;
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
  const page = (pageNumber - 1) * limitOfPerPage;
  const listKey = await toFunction(
    apiKeyModel.listInLimit(idUser, page, limitOfPerPage)
  );
  if (listKey[0]) {
    return next(listKey[0]);
  }
  listKey[1] = listKey[1].map((elem, index) => {
    let status = "Enable";
    if (elem.valid) {
      status = "Disable";
    }
    elem.date_expired = moment(elem.date_expired).format("DD/MM/YYYY");
    elem.status = status;
    elem.index = page + index + 1;
    return elem;
  });
  const message = req.session.message;
  // eslint-disable-next-line require-atomic-updates
  req.session.message = null;
  res.render("statistic/userdetail", {
    title: "Express",
    user: req.user,
    listKey: listKey[1],
    pages,
    message
  });
});
router.post("/changekey", async (req, res) => {
  const key = await apiKeyModel.searchKey(req.body.id);

  key[0].value = genKey();
  await apiKeyModel.update(key[0]);
  // eslint-disable-next-line require-atomic-updates
  req.session.message = "Changed user's key successfully !!!";
  res.redirect(`${req.headers.referer}`);
});
//-----------------------------------------------
router.post("/renewkey", async (req, res) => {
  let key = await apiKeyModel.singleById(req.body.idKey);
  key[0].date_expired = moment(key[0].date_expired)
    .add(key[0].term, "days")
    .format("YYYY-MM-DD");
  await apiKeyModel.update(key[0]);
  // eslint-disable-next-line require-atomic-updates
  req.session.message = "Renewed user's key successfully !!!";
  res.redirect(`${req.headers.referer}`);
});
//-----------------------------------------------
router.post("/validkey", async (req, res, next) => {
  
  let key = await toFunction(apiKeyModel.singleById(req.body.idKey));
  if (key[0]) {
    return next(key[0]);
  }
  key[1][0].valid = !key[1][0].valid;
  const result = await toFunction(apiKeyModel.update(key[1][0]));
  if (result[0]) {
    return next(result[0]);
  } else {
    // eslint-disable-next-line require-atomic-updates
    req.session.message = "Changed valid user's key successfully !!!";
    res.redirect(`${req.headers.referer}`);
  }
});
// ---------------------------------------------------------------
module.exports = router;