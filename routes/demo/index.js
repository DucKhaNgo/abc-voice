var express = require("express");
var router = express.Router();

var uploadSingleFile = require("./upload");
// packages upload file
const multer = require("multer");
var upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    cb(null, true);
  }
});
router.get("/", uploadSingleFile.get);
router.post("/", upload.single("myFile"), uploadSingleFile.post);
module.exports = router;
