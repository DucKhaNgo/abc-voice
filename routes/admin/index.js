const express = require("express");
const router = express.Router();
const UserRouter = require("./user");
const UserDetailRouter = require("./userDetail");
const Statistic = require("./statistic");
const packagemanage = require("./packageManage");
// ---------------------------------------------------------------
router.use(Statistic);
router.use("/usermanage", UserRouter);
router.use("/userdetail", UserDetailRouter);
router.use("/packagemanage", packagemanage);
// ---------------------------------------------------------------
module.exports = router;
