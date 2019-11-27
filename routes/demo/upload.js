var request = require("request");

module.exports = {
  post: async (req, res) => {
    let wdRes = res;
    let wdReq = req;
    const url = "https://server-sound-api.herokuapp.com";
    let jsonData = "";
    const file = req.file;
    if (
      file.mimetype !== "audio/wav" &&
      file.mimetype !== "audio/wave" &&
      file.mimetype !== "audio/x-wav"
    ) {
      wdReq.session.message = "Chỉ chấp nhận file .wav";
      wdRes.redirect("/demo");
      return;
    }
    if (!file) {
      wdReq.session.message = "Please upload a file";
      wdRes.redirect("/demo");
      return;
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
    request.post({ url: url, formData: formData }, async (err, _res, body) => {
      if (err) {
        wdReq.session.error = err;
        wdRes.redirect("/demo");
        return;
      } else {
        jsonData = JSON.parse(body);
        console.log("Upload successful!  Server responded with:", jsonData);
        wdReq.session.filename = file.originalname;
        wdReq.session.jsonData = jsonData["text"];
        wdRes.redirect("/demo");
      }
    });
  },
  get: async (req, res) => {
    let jsonData = "";
    let descriptionFile = "";
    if (req.session.filename) {
      jsonData = req.session.jsonData;
      descriptionFile = req.session.filename;
    }
    let message = req.session.message;
    req.session.message = null;
    res.render("./demo/demo", {
      title: "Phiên dịch",
      jsonData: jsonData,
      descriptionFile: descriptionFile,
      user: req.user,
      message: message
    });
  }
};
