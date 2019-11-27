var express = require("express");
var router = express.Router();
var keyModel = require("../../model/key.model");

var request = require("request");
// packages upload file
const multer = require("multer");

// SET STORAGE
var storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  cb(null, true);
};
var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.post("/", upload.single("myFile"), async (req, res) => {
  let wdRes = res;
  const url = "https://server-sound-api.herokuapp.com";
  let jsonData = "";
  const file = req.file;
  console.log("file in request---", file);
  if (!file) {
    return res.status(400).json("Please upload a file");
  }
  if (
    file.mimetype !== "audio/wav" &&
    file.mimetype !== "audio/wave" &&
    file.mimetype !== "audio/x-wav"
  ) {
    return res.status(400).json("Chỉ chấp nhận file .wav");
  }
  const apiKey = req.body.apiKey;
  const rows = await keyModel.searchKey(apiKey);
  if (rows.length === 0 || rows[0].valid === 0) {
    return res.status(400).json("API invalid");
  }
  var formData = {
    voice: {
      value: file.buffer,
      options: {
        filename: file.originalname,
        contentType: file.mimetype
      }
    }
  };
  request.post({ url: url, formData: formData }, async (err, res, body) => {
    if (err) {
      wdRes.json(err.message);
    } else {
      jsonData = JSON.parse(body);
      wdRes.json(jsonData["text"]);
    }
  });
});
module.exports = router;
