const request = require("supertest");
const { context } = require("mocha");
const app = require("../app");

let cookie = "";
describe("Test the login path", () => {
  describe("Get", () => {
    test("Should response the GET method", done => {
      request(app)
        .get("/login")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
  describe("Post", () => {
    test("Should login user account successfull", done => {
      request(app)
        .post("/login")
        .send({ email: "test@test", password: "123456" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/");
          done();
        });
    });
    test("Should login admin account successfully", done => {
      request(app)
        .post("/login")
        .send({ email: "admin@admin", password: "123456" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("admin/accessmanage");
          done();
        });
    });
    test("Should login user account failed", done => {
      request(app)
        .post("/login")
        .send({ email: "wrongaccount", password: "123456" })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
  });
});
