const request = require("supertest");
const { context } = require("mocha");
const app = require("../app");

let cookie = "";
describe("Test the register path", () => {
  describe("Get", () => {
    test("Get /register", done => {
      request(app)
        .get("/register")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
});
