let db = require("../util/db");

module.exports = {
  add: entity => {
    return db.add("key", entity);
  },
  singleById: id => {
    return db.load(`select * from KeyPackages where id='${id}'`);
  },
  findOne: id => {
    return db.load(`select * from KeyPackages where id=${id}`);
  },
  createEntity: () => ({
    user: "",
    key: ""
  }),
  getAll: () => {
    return db.load(`select * from KeyPackages where id <> 0`);
  }
};
