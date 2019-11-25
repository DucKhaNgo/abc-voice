var auth = require("../middleware/auth");
var user = require("./user");
var admin = require("./admin");

const router = async app => {
  app.get("/", (req, res) => res.redirect("/home"));
  app.use("/home", auth.common, require("./home"));
  app.use("/profile", auth.user, user.profile);
  app.use("/login", auth.guest, user.login); //đăng nhập rồi thì không cho vô login nữa kkk
  app.use("/forgotPassword", user.forgotPass);
  app.use("/logout", auth.signedUp, user.logout);
  app.use("/register", user.register);
  app.use("/recoverPassword", user.changePass);
  app.use("/demo", auth.common, require("./demo"));
  app.use("/abcvoiceapi", auth.common, require("./api/abcvoiceAPI"));
  app.use("/apidoc", auth.common, require("./document"));
  app.use("/packages", auth.common, require("./packages"));
  app.use("/admin", auth.admin, admin);
};

module.exports = router;
