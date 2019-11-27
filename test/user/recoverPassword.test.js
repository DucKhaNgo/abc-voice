const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const loginDTO = { email: "test@test", password: "123456" };
const bcrypt = require("bcrypt");
const userModel = require("../../model/user.model");
let cookie = "";
const mockReturnValue = Promise.resolve([mockUser]);
beforeAll(async () => {
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  userModel.findByEmail = jest.fn().mockReturnValue(mockReturnValue);
  await request(app)
    .post("/login")
    .send(loginDTO)
    .then(response => {
      cookie = response.header["set-cookie"][0];
      console.log(cookie);
    });
});
describe("Test /recoverPassword", () => {
  describe("Get", () => {
    test("/recoverPassword in case changePass ", async done => {
      await request(app)
        .get("/recoverPassword")
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
        });
      request(app)
        .get("/recoverPassword")
        .set("Cookie", cookie)
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("/recoverPassword in case forgot", done => {
      userModel.verifyRecoverToken = jest.fn().mockReturnValue(mockUser);
      request(app)
        .get("/recoverPassword?id=1")
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/forgotPassword");
          done();
        });
    });
  });
  describe("Post", () => {
    test("/recoverPassword in case forgot ", async done => {
      bcrypt.hashSync = jest.fn().mockReturnValue("");
      userModel.changePassword = jest.fn().mockReturnValue(Promise.resolve());

      request(app)
        .post("/recoverPassword")
        .send(loginDTO)
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          expect(bcrypt.hashSync).toHaveBeenCalled();
          expect(userModel.changePassword).toHaveBeenCalled();
          done();
        });
    });
    test("change password with invalid oldPass", async done => {
      userModel.findByEmail = jest.fn().mockReturnValue(mockReturnValue);
      bcrypt.compareSync = jest.fn().mockReturnValue(false);
      await request(app)
        .post("/recoverPassword")
        .set("Cookie", cookie)
        .send({ old_password: "1234567", password: "123456789" })
        .then(response => {
          expect(userModel.findByEmail).toHaveBeenCalled();
          expect(bcrypt.compareSync).toHaveBeenCalled();

          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/recoverPassword");
          done();
        });
    });
    test("/recoverPassword in case change success ", async done => {
      userModel.findByEmail = jest.fn().mockReturnValue(mockReturnValue);
      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      bcrypt.hashSync = jest.fn().mockReturnValue("abc");
      userModel.changePassword = jest.fn().mockReturnValue(Promise.resolve());

      await request(app)
        .post("/recoverPassword")
        .set("Cookie", cookie)
        .send({ old_password: "123456", password: "123456789" })
        .then(response => {
          // ------------------------------------------------
          expect(userModel.findByEmail).toHaveBeenCalled();
          expect(bcrypt.compareSync).toHaveBeenCalled();
          expect(bcrypt.hashSync).toHaveBeenCalled();
          expect(userModel.changePassword).toHaveBeenCalled();
          // ------------------------------------------------
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
  });
});
