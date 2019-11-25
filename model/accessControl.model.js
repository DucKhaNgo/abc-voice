let db = require("../util/db");

module.exports = {
  add: entity => {
    return db.add("api_key", entity);
  },
  searchKey: id => {
    return db.load(`select * from api_key where value='${id}'`);
  },
  singleByYearAndMonth: year => {
    return db.load(
      `select * from accessControl where year='${year}' order by month ASC`
    );
  },
  update: entity => {
    return db.update("api_key", "id", entity);
  }
};
