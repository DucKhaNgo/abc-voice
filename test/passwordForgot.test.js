const request = require("supertest");
const app = require("../app");
let cookie = "";
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
      await request(app)
        .post("/login")
        .send({ email: "test@test", password: "123456" })
        .then(response => {
          cookie = response.header["set-cookie"][0];
        });
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
        .send({ email: "test@test" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe(
            "/forgotPassword/nortificationRequest"
          );
          done();
        });
    });
    test("/forgotPassword failed", async done => {
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
