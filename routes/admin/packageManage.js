/* GET home page. */
var express = require("express");
var router = express.Router();
const packageModel = require("../../model/packageKey.model");
const toFunction = require("../../util/toFunction");
const limitOfPerPage = require("../../const").limitOfPerPage;

router.get("/", async (req, res, next) => {
  const pageNumber = Number(req.query.page || 1);
  const getSizeOfTotal = await packageModel.count();
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
  const listPackage = await toFunction(
    packageModel.listInLimit(page, limitOfPerPage)
  );
  if (listPackage[0]) {
    return next(listPackage[0]);
  }
  listPackage[1] = listPackage[1].map((elem, index) => {
    elem.index = page + index + 1;
    let status = "Enable";
    if (elem.valid) {
      status = "Disable";
    }
    elem.status = status;
    return elem;
  });
  const message = req.session.message;
  // eslint-disable-next-line require-atomic-updates
  req.session.message = null;
  res.render("packageManage/packageManage", {
    title: "Express",
    user: req.user,
    listPackage: listPackage[1],
    pages,
    message
  });
});
router.post("/validpackage", async (req, res, next) => {
  let pack = await toFunction(packageModel.singleById(req.body.idPackage));
  if (pack[0]) {
    return next(pack[0]);
  }

  pack[1][0].valid = !pack[1][0].valid;

  // eslint-disable-next-line require-atomic-updates
  const result = await toFunction(packageModel.update(pack[1][0]));
  if (result[0]) {
    return next(result[0]);
  } else {
    // eslint-disable-next-line require-atomic-updates
    req.session.message = "Changed valid package successfully !!!";
    res.redirect(`${req.headers.referer}`);
  }
});
router.post("/addpackage", async (req, res, next) => {
  const {name,term,price,numReq} = req.body;
  const pack = packageModel.createPackage(name, term, price,numReq);
  const result = await toFunction(packageModel.add(pack));
  if (result[0]) {
    return next(result[0]);
  } else {
    // eslint-disable-next-line require-atomic-updates
    req.session.message = "Added new package successfully !!!";
    res.redirect(`${req.headers.referer}`);
  }
});
//-----------------------------------------------
router.post("/editpackage", async (req, res, next) => {
  const {idPack,name,term,price,numReq} = req.body;
  let pack = await toFunction(packageModel.singleById(idPack));
  if (pack[0]) {
    return next(pack[0]);
  }
  pack[1][0].name = name;
  pack[1][0].term = term;
  pack[1][0].price = price;
  pack[1][0].limitNumberOfReq = numReq;
  const result = await toFunction(packageModel.update(pack[1][0]));
  if (result[0]) {
    return next(result[0]);
  } else {
    // eslint-disable-next-line require-atomic-updates
    req.session.message = "Edited package successfully !!!";
    res.redirect(`${req.headers.referer}`);
  }
});
module.exports = router;