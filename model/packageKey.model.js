let db = require("../util/db");

module.exports = {
  add: entity => {
    return db.add("KeyPackages", entity);
  },
  update: entity => {
    return db.update("KeyPackages", "id", entity);
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
  count: () => db.load(`select count (*) as count from KeyPackages`),
  listInLimit: (page, limitPerPage) =>
    db.load(`select * from KeyPackages limit ${page},${limitPerPage}`),
  createPackage: (name, term, price,numReq) => {
    const entity = {};
    entity.name = name;
    entity.term = term;
    entity.valid = true;
    entity.price = price;
    entity.limitNumberOfReq = numReq;
    return entity;
  },
  getAll: () => {
    return db.load(`select * from KeyPackages where id <> 0 and valid = true`);
  }
};