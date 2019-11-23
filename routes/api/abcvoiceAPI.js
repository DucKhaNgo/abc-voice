var express = require("express");
var router = express.Router();
var keyModel = require("../../model/key.model");

var request = require("request");
// packages upload file
const multer = require("multer");

// SET STORAGE
var storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log(file);
  // if (file.mimetype === "audio/wav") {
  cb(null, true);
  // } else {
  //   cb(new Error("Chỉ chấp nhận file .wav"), false);
  // }
};
var upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.post("/", upload.single("myFile"), async (req, res, next) => {
  let wdRes = res;
  const url = "https://server-sound-api.herokuapp.com";
  let jsonData = "";
  const file = req.file;
  console.log("file in request---", file);
  if (
    file.mimetype !== "audio/wav" &&
    file.mimetype !== "audio/wave" &&
    file.mimetype !== "audio/x-wav"
  ) {
    const error = new Error("Chỉ chấp nhận file .wav");
    error.httpStatusCode = 400;
    return next(error);
  }
  const apiKey = req.body.apiKey;
  const rows = await keyModel.searchKey(apiKey);
  if (rows.length === 0 || rows[0].valid === 0) {
    console.log("hahahahahha");
    const error = new Error("API KEY invalid");
    error.httpStatusCode = 400;
    return next(error);
  }
  if (!file) {
    const error = new Error("Please upload a file");
    error.httpStatusCode = 400;
    return next(error);
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
router.post("/a", async (req, res) => {
  const id = req.body.key;
  const getKey = await keyModel.singleById(id);
  if (getKey.length > 0) {
    res.send("api OK");
  } else {
    res.send("api key not correct");
  }
});

// router.get("/", (req, res, next) => {
//   let jsonData = "";
//   let descriptionFile = "";
//   if (req.session.filename) {
//     jsonData = req.session.jsonData;
//     descriptionFile = req.session.filename;
//   }
//   res.render("callApi/callapi", {
//     title: "Phiên dịch",
//     jsonData: jsonData,
//     descriptionFile: descriptionFile
//   });
// });
module.exports = router;
