  const request = require("supertest");
const { context } = require("mocha");
const app = require("../app");
const userModel = require("../model/user.model");
const bcrypt = require("bcrypt");

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
      const user = { email: "test@test", password: "123456" };
      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      userModel.findByEmail = jest
        .fn()
        .mockReturnValue(new Promise((result, reject) => result([user])));
      request(app)
        .post("/login")
        .send(user)
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/");
          done();
        });
    });

    test("Should login admin account successfully", done => {
      const user = { email: "test@test", password: "123456" };
      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      userModel.findByEmail = jest
        .fn()
        .mockReturnValue(
          new Promise((result, reject) => result([{ ...user, role: "admin" }]))
        );
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
      const user = { email: "test@test", password: "123456" };
      bcrypt.compareSync = jest.fn().mockReturnValue(true);
      userModel.findByEmail = jest
        .fn()
        .mockReturnValue(new Promise((result, reject) => result([])));
      request(app)
        .post("/login")
        .send(user)
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
  });
});
