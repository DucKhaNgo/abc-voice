const request = require("supertest");
const { context } = require("mocha");
const app = require("../app");

describe("Test /logout", () => {
  describe("Get", () => {
    test("Should response the GET method", done => {
      request(app)
        .get("/logout")
        .then(response => {
          expect(response.statusCode).toBe(403);
          done();
        });
    });
    test("Should login user account successfull", async done => {
      await request(app)
        .post("/login")
        .send({ email: "admin@admin", password: "123456" })
        .then(response => {
          cookie = response.header["set-cookie"][0];
        });
      request(app)
        .get("/logout")
        .set("Cookie", cookie)
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/");
          done();
        });
    });
  });
});
