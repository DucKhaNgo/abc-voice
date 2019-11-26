const request = require("supertest");
const app = require("../../app");
let cookie = "";

describe("Test the home path", () => {
  test("Should successfull", done => {
    request(app)
      .get("/home")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
