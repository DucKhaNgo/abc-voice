const request = require("supertest");
const app = require("../app");
let cookie = "";
describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .post("/login")
      .send({ email: "admin@admin", password: "123456" })
      .then(response => {
        cookie = response.header["set-cookie"][0];
        expect(response.statusCode).toBe(302);
        done();
      });
  });
  test("It should response the GET method2Ư", done => {
    request(app)
      .get("/admin/accessmanage")
      .set("Cookie", cookie)
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});
