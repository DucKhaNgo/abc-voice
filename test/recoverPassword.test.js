const request = require("supertest");
const app = require("../app");
let cookie = "";
const login = async () => {
  return await request(app)
    .post("/login")
    .send({ email: "test@test", password: "123456" })
    .then(response => {
      cookie = response.header["set-cookie"][0];
    });
};
beforeAll(async () => {
  return await login();
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
      await request(app)
        .post("/recoverPassword")
        .send({ email: "test@test", password: "123456789" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
        });
      await request(app)
        .post("/recoverPassword")
        .send({ email: "test@test", password: "123456" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
    test("/recoverPassword in case change failed ", async done => {
      await request(app)
        .post("/recoverPassword")
        .set("Cookie", cookie)
        .send({ old_password: "1234567", password: "123456789" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/recoverPassword");
          done();
        });
    });

    test("/recoverPassword in case change success ", async done => {
      login();
      await request(app)
        .post("/recoverPassword")
        .set("Cookie", cookie)
        .send({ old_password: "123456", password: "123456789" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
        });
      await request(app)
        .post("/recoverPassword")
        .send({ email: "test@test", password: "123456" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
  });
});
