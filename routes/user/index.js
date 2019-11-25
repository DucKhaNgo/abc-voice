module.exports = {
  logout: require("./logout"),
  recoverPassword: require("./recoverPassword"),
  profile: require("./userInfo"),
  login: require("./login"),
  changePass: require("./recoverPassword"),
  forgotPass: require("./passwordForgot").router,
  register: require("./register")
};
