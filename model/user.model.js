let db = require("../util/db");
module.exports = {
  add: entity => {
    return db.add("user", entity);
  },
  singleByUsername: username => {
    return db.load(`select * from user where username = '${username}'`);
  },
  singleById: id => {
    return db.load(`select * from user where id=${id}`);
  },
  login: (email, password) => {
    return db.load(
      `select * from user where email='${email}' and password='${password}'`
    );
  },
  findByEmail: email => db.load(`select * from user where email='${email}'`),

  verifyEmail: () => {
    return [];
    //tìm record chứa token sau đó update cột token => null và cột isActivated => true, nếu k tìm thấy return null
  },
  update: entity => {
    db.update("user", "id", entity);
  },
  verifyRecoverToken: token =>
    db.load(`select * from user where token='${token}'`),
  addRecoverToken: entity => db.update("user", "email", entity),
  changePassword: (email, info) =>
    db.load(`UPDATE user SET PASSWORD = '${info}' WHERE email = '${email}'`),
  findApiKeys: id => db.load(`select * from api_key where user_id = '${id}' `),
  count: () => db.load(`select count (*) from user `),
  listInLimit: (page, limitPerPage) =>
    db.load(
      `select * from user where role!="admin" limit ${page},${limitPerPage}`
    )
};
