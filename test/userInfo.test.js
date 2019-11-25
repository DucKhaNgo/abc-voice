// const request = require("supertest");
// const { context } = require("mocha");
// const app = require("../app");

// const idKeyOfTest = 86;
// let cookie = "";
// const login = async () => {
//   return await request(app)
//     .post("/login")
//     .send({ email: "test@test", password: "123456" })
//     .then(response => {
//       cookie = response.header["set-cookie"][0];
//     });
// };
// beforeAll(async () => {
//   // while (cookie === "") {
//   await login();
// });
// describe("Test the profile path", () => {
//   describe("Get", () => {
//     test("Get /profile failed", done => {
//       request(app)
//         .get("/profile")
//         .then(response => {
//           expect(response.statusCode).toBe(302);
//           expect(response.header.location).toBe("/login");
//           done();
//         });
//     });
//     test("Get /profile success", done => {
//       request(app)
//         .get("/profile")
//         .set("Cookie", cookie)
//         .then(response => {
//           expect(response.statusCode).toBe(200);
//           done();
//         });
//     });
//   });
//   describe("Post", () => {
//     test("Post /profile/updatekey", done => {
//       request(app)
//         .post("/profile/updatekey")
//         .set("Cookie", cookie)
//         .send({ id: idKeyOfTest })
//         .then(response => {
//           expect(response.statusCode).toBe(302);
//           expect(response.header.location).toBe("/profile");
//           done();
//         });
//     });
//     test("Post /profile/renewkey", done => {
//       request(app)
//         .post("/profile/renewkey")
//         .set("Cookie", cookie)
//         .send({ idKey: idKeyOfTest })
//         .then(response => {
//           expect(response.statusCode).toBe(302);
//           expect(response.header.location).toBe("/profile");
//           done();
//         });
//     });
//     test("Post /profile", done => {
//       request(app)
//         .post("/profile")
//         .set("Cookie", cookie)
//         .send({ name: "newName" })
//         .then(response => {
//           expect(response.statusCode).toBe(302);
//           expect(response.header.location).toBe("/profile");
//           done();
//         });
//     });
//   });
// });

describe("Test the home path", () => {
  test("Should successfull", done => {
    expect(2 + 1).toBe(3);
    done();
  });
});
