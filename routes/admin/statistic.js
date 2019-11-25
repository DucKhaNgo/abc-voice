const express = require("express");
const router = express.Router();
const accessControlModel = require("../../model/accessControl.model");
const moment = require("moment");
const apiKeyModel = require("../../model/key.model");
// const keyModel = require("../../model/packageKey.model");
// ---------------------------------------------------------------
router.get("/accessmanage", async (req, res) => {
  // console.log(req.user);
  const year = req.query.year || moment().year();
  // console.log("year-----", year);
  const access = await accessControlModel.singleByYearAndMonth(year);
  // let dataAccess = Array(12).fill(Object.assign({}, {id: 0, value: 0}));
  let dataAccess = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];
  // console.log("dataaccess----", dataAccess);
  // console.log("access---", access);
  access.forEach((element, index) => {
    // // console.log("elem----", element);
    // // console.log("dinexxx--", index);
    dataAccess[index].id = index + 1;
    dataAccess[index].value = element.access;
    // console.log(dataAccess[index]);
  });
  // console.log("dataaceessAfter----", dataAccess);
  res.render("statistic/accessNumber", {
    title: "Express",
    user: req.user,
    dataAccess,
    ByYearValue: year
  });
});
// ---------------------------------------------------------------
router.get("/revenuemanage", async (req, res) => {
  // console.log(req.user);
  const year = req.query.revenueByYear || moment().year();
  // console.log("year--", year);
  const total = [];
  for (let i = 1; i <= 12; i++) {
    const monthFormat = ("0" + i).slice(-2);
    const thang = await apiKeyModel.getAllKeyByYear(year, monthFormat);
    if (thang[0].total === null) {
      thang[0].total = 0;
    }
    total.push({ id: i, totalSum: thang[0].total });
  }
  // const allPackage = await keyModel.getAll();
  const yearBymonth = req.query.yearByMonth || moment().year();
  const monthBymonth = req.query.monthByMonth || moment().month() + 1;
  let byMonth = await apiKeyModel.getAllKeyByYearPackage(
    yearBymonth,
    monthBymonth
  );
  byMonth = byMonth.map((elem, index) => {
    elem.id = index + 100;
    elem.idName = index + 1000;
    return elem;
  });

  // console.log("byMonth----", byMonth);
  // console.log("allPackage----", allPackage);
  // console.log("total----", total);
  const numberPackage = byMonth.length;
  res.render("statistic/revenue", {
    title: "Express",
    user: req.user,
    total,
    byMonth,
    numberPackage,
    ByYearValue: year,
    ByMonthmonthValue: monthBymonth,
    ByMonthyearValue: yearBymonth
  });
});
module.exports = router;
