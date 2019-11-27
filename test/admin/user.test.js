const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const loginDTO = { email: "test@test", password: "123456" };
const userModel = require("../../model/user.model");
const keyModel = require("../../model/key.model");
const bcrypt = require("bcrypt");
const limitOfPerPage = require("../../const").limitOfPerPage;
const accessControlModel = require("../../model/accessControl.model");
let cookie = "";
beforeAll(async () => {
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  userModel.findByEmail = jest
    .fn()
    .mockReturnValue(Promise.resolve([{ ...mockUser, role: "admin" }]));
  await request(app)
    .post("/login")
    .send(loginDTO)
    .then(response => {
      cookie = response.header["set-cookie"][0];
    });
});
const mockUserList = [
  {
    id: 49,
    password: "$2b$10$hfoYXs2ngY866P9KOtzBKOreJhJ94NVgXd8eY3xj11ezDerMG4UZa",
    role: "user",
    email: "trandinhkhai@gmail.com",
    name: "NoName",
    token: "null",
    isActivated: 1,
    valid: 1
  }
];
const getSizeOfTotal = [{ "count (*)": 29 }];

describe("Test manage user", () => {
  describe("Get UserManage", () => {
    userModel.count = jest
      .fn()
      .mockReturnValue(Promise.resolve(getSizeOfTotal));
    userModel.listInLimit = jest
      .fn()
      .mockReturnValue(Promise.resolve(mockUserList));
    test("Success", done => {
      request(app)
        .get("/admin/usermanage")
        .set("Cookie", cookie)
        .then(res => {
          expect(userModel.count).toHaveBeenCalled();
          expect(userModel.listInLimit).toHaveBeenCalledWith(0, limitOfPerPage);
          expect(res.statusCode).toBe(200);
          done();
        });
    });
  });
});
