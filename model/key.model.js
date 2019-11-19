let db = require("../util/db");
var genKey = require("../function/genarateKey");

module.exports = {
  add: entity => {
    return db.add("api_key", entity);
  },
  searchKey: id => {
    return db.load(`select * from api_key where value='${id}'`);
  },
  singleById: id => {
    return db.load(`select * from api_key where id='${id}'`);
  },
  update: entity => {
    return db.update("api_key", "id", entity);
  },
  getKeyById: id => {
    return db.load(`select * from api_key where user_id='${id}' and valid = 1`);
  },
  countOderByUserId: (userId) => {
    return db.load(`select count (*) from api_key where user_id='${userId}'`);
  },
  listInLimit:(userId,page,limitPerPage) => db.load(`select * from api_key where user_id='${userId}' limit ${page},${limitPerPage}`),
  createEntity: (packages, userId, OTP) => {
    const entity = {};
    const today = new Date();
    entity.value = genKey();
    entity.id_package = packages.id;
    entity.user_id = userId;
    entity.date_start = today;
    entity.valid = false;
    entity.price = packages.price;
    const date_expired = new Date();
    entity.date_expired = new Date(
      date_expired.setDate(today.getDate() + packages.term)
    );
    entity.name_package = packages.name;
    entity.transactionId = OTP;
    console.log("entity---", entity);
    return entity;
  },
  createFreeKey: userId => {
    const entity = {};
    const today = (entity.value = genKey());
    entity.id_package = 0;
    entity.user_id = userId;
    entity.date_start = new Date();
    entity.valid = true;
    entity.price = 0;
    entity.date_expired = new Date();
    entity.name_package = "Free";
    entity.transactionId = null;
    return entity;
  },
  getKeyByTransactionId: (idUser,transactionId) => {
    return db.load(
      `select * from api_key where transactionId='${transactionId}' and user_id ='${idUser}'`
    );
  },
  getAllKeyByYear: (year, month) => {
    return db.load(`select SUM(price) as total from api_key where date_start like '${year}-${month}%' order by id ASC`)
  },
  getAllKeyByYearPackage: (year, month) => {
    return db.load(`select SUM(price) as total, name_package from api_key where date_start like '${year}-${month}%' and name_package <> 'Free' GROUP BY name_package`)
  }
};
