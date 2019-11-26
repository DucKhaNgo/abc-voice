const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const loginDTO = { email: "test@test", password: "123456" };
const userModel = require("../../model/user.model");
const bcrypt = require("bcrypt");
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
      console.log(cookie);
    });
});
describe("Test the admin packageManage", () => {
  test("Failed get due to error 403", done => {
    request(app)
      .get("/admin/packagemanage")
      .then(res => {
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe("/login");
        done();
      });
  });
  test("Success get", done => {
    request(app)
      .get("/admin/packagemanage")
      .set("Cookie", cookie)
      .then(res => {
        expect(res.statusCode).toBe(200);
        done();
      });
  });
});
