const request = require("supertest");
const app = require("../../app");
let cookie = "";
const bcrypt = require("bcrypt");
const userModel = require("../../model/user.model");
let {
  sendmailRecover,
  smtpTransport
} = require("../../routes/user/passwordForgot");
let user = null;
beforeAll(async () => {
  sendmailRecover = jest.fn().mockReturnValue(Promise.resolve("token"));
  smtpTransport.sendMail = jest.fn().mockReturnValue(Promise.resolve());
  user = { email: "test@test", password: "123456" };
  const mockReturnValue = new Promise((result, reject) =>
    result([{ ...user, role: "user" }])
  );
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  userModel.findByEmail = jest.fn().mockReturnValue(mockReturnValue);
  userModel.addRecoverToken = jest.fn().mockReturnValue(Promise.resolve());

  await request(app)
    .post("/login")
    .send(user)
    .then(response => {
      cookie = response.header["set-cookie"][0];
      console.log(cookie);
    });
});

describe("Test /forgotPassword", () => {
  describe("Get", () => {
    test("/forgotPassword", done => {
      request(app)
        .get("/forgotPassword")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("/forgotPassword/nortificationRequest", done => {
      request(app)
        .get("/forgotPassword/nortificationRequest")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("/forgotPassword/newPassword", async done => {
      request(app)
        .get("/forgotPassword/newPassword")
        .set("Cookie", cookie)
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
  describe("Post", () => {
    test("/forgotPassword success", async done => {
      await request(app)
        .post("/forgotPassword")
        .send(user)
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe(
            "/forgotPassword/nortificationRequest"
          );
          done();
        });
    });
    test("/forgotPassword failed", async done => {
      userModel.findByEmail = jest.fn().mockReturnValue([]);
      await request(app)
        .post("/forgotPassword")
        .send({ email: "wrongEmail" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/forgotPassword");
          done();
        });
    });
  });
});
