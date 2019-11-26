const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const loginDTO = { email: "test@test", password: "123456" };
const userModel = require("../../model/user.model");
const keyModel = require("../../model/key.model");
const bcrypt = require("bcrypt");
const limitOfPerPage = require("../../const").limitOfPerPage;
const accessControlModel = require("../../model/accessControl.model");
const moment = require("moment");
jest.mock("../../function/genarateKey");
let genKey = require("../../function/genarateKey");
let cookie = "";
const mockSearchKey = [
  {
    id: 44,
    value: "d46641de0dd700f82c5b17e0be468837",
    id_package: 6,
    user_id: 39,
    date_start: Date.now(),
    valid: 1,
    price: 1800000,
    date_expired: Date.now(),
    name_package: "Year Advanced",
    transactionId:
      "G6-$2b$10$Bs3m89jxPVb1ku4/3ZnaY.1V2thVl09r5kyuEEOda9RCDdbORpuR2",
    term: 0
  }
];
beforeAll(async () => {
  // ----------------------------------------
  keyModel.searchKey = jest
    .fn()
    .mockReturnValue(Promise.resolve(mockSearchKey));
  keyModel.countOderByUserId = jest
    .fn()
    .mockReturnValue(Promise.resolve([{ count: 2 }]));
  keyModel.listInLimit = jest
    .fn()
    .mockReturnValue(Promise.resolve([mockSearchKey]));
  keyModel.update = jest.fn();
  keyModel.singleById = jest
    .fn()
    .mockReturnValue(Promise.resolve(mockSearchKey));
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  userModel.findByEmail = jest
    .fn()
    .mockReturnValue(Promise.resolve([{ ...mockUser, role: "admin" }]));
  //----------------------------------------------
  await request(app)
    .post("/login")
    .send(loginDTO)
    .then(response => {
      cookie = response.header["set-cookie"][0];
    });
});

describe("Test UserDetail", () => {
  describe("Get UserDetail", () => {
    test("Success", done => {
      const userId = "1";
      request(app)
        .get(`/admin/userdetail/${userId}`)
        .set("Cookie", cookie)
        .then(res => {
          expect(keyModel.countOderByUserId).toHaveBeenCalled();
          expect(keyModel.listInLimit).toHaveBeenCalledWith(
            userId,
            0,
            limitOfPerPage
          );
          expect(res.statusCode).toBe(200);
          done();
        });
    });
  });
  describe("Post UserDetail", () => {
    test("Change Key", done => {
      const newKey = "newKey";
      genKey.mockReturnValue(newKey);
      const body = { id: 1 };
      request(app)
        .post("/admin/userdetail/changekey")
        .set("Cookie", cookie)
        .send(body)
        .then(res => {
          expect(genKey).toHaveBeenCalled();
          expect(res.statusCode).toBe(302);
          expect(keyModel.searchKey).toHaveBeenCalledWith(body.id);
          expect(keyModel.update).toHaveBeenCalledWith({
            ...mockSearchKey[0],
            value: newKey
          });
          done();
        });
    });
    test("Renew Key", done => {
      const body = {
        idKey: 1
      };
      const key = mockSearchKey;
      key[0].date_expired = moment(key[0].date_expired)
        .add(key[0].term, "days")
        .format("YYYY-MM-DD");
      request(app)
        .post("/admin/userdetail/renewkey")
        .set("Cookie", cookie)
        .send(body)
        .then(res => {
          expect(res.statusCode).toBe(302);
          expect(keyModel.singleById).toHaveBeenCalledWith(body.idKey);
          expect(keyModel.update).toHaveBeenCalledWith(key[0]);
          done();
        });
    });
    test("Valid Key", done => {
      const body = {
        idKey: 1
      };
      const key = mockSearchKey;
      key[0].valid = !key[0].valid;
      request(app)
        .post("/admin/userdetail/renewkey")
        .set("Cookie", cookie)
        .send(body)
        .then(res => {
          expect(res.statusCode).toBe(302);
          expect(keyModel.singleById).toHaveBeenCalledWith(body.idKey);
          expect(keyModel.update).toHaveBeenCalledWith(key[0]);
          done();
        });
    });
  });
});
