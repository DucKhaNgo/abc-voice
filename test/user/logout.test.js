// const request = require("supertest");
// const { context } = require("mocha");
// const app = require("../app");
// const bcrypt = require("bcrypt");
// const userModel = require("../model/user.model");

// describe("Test /logout", () => {
//   describe("Get", () => {
//     test("Should response the GET method", done => {
//       request(app)
//         .get("/logout")
//         .then(response => {
//           expect(response.statusCode).toBe(403);
//           done();
//         });
//     });

//     test("Should logout user account successfull", async done => {
//       const user = { email: "test@test", password: "123456" };
//       bcrypt.compareSync = jest.fn().mockReturnValue(true);
//       userModel.findByEmail = jest
//         .fn()
//         .mockReturnValue(new Promise((resovle, reject) => resovle([user])));
//       await request(app)
//         .post("/login")
//         .send(user)
//         .then(response => {
//           cookie = response.header["set-cookie"][0];
//         });
//       request(app)
//         .get("/logout")
//         .set("Cookie", cookie)
//         .then(response => {
//           expect(response.statusCode).toBe(302);
//           expect(response.header.location).toBe("/");
//           done();
//         });
//     });
//   });
// });
