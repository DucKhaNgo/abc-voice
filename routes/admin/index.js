const express = require("express");
const router = express.Router();
const UserRouter = require("./user");
const UserDetailRouter = require("./userDetail");
const Statistic = require("./statistic");
// ---------------------------------------------------------------
router.use(Statistic);
router.use("/usermanage", UserRouter);
router.use("/userdetail", UserDetailRouter);
// ---------------------------------------------------------------
module.exports = router;
