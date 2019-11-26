const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const userModel = require("../../model/user.model");
const keyModel = require("../../model/key.model");
const bcrypt = require("bcrypt");

describe("Test the register path", () => {
  describe("Get", () => {
    test("Get register page should success", done => {
      request(app)
        .get("/register")
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });
  });
  describe("Post", () => {
    test("Should register failed due to missing params", done => {
      userModel.findByEmail = jest.fn();
      request(app)
        .post("/register")
        .then(response => {
          expect(userModel.findByEmail).not.toHaveBeenCalled();
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("Should register failed due to user already exits", done => {
      userModel.findByEmail = jest.fn().mockReturnValue([mockUser]);
      userModel.add = jest.fn();
      request(app)
        .post("/register")
        .send({ email: "abc", password: "abc" })
        .then(response => {
          // -----------------------------------------------
          expect(userModel.findByEmail).toHaveBeenCalled();
          expect(userModel.add).not.toHaveBeenCalled();
          // -----------------------------------------------
          expect(response.statusCode).toBe(200);
          done();
        });
    });
    test("Should register success", done => {
      userModel.findByEmail = jest.fn().mockReturnValue([]);
      userModel.add = jest
        .fn()
        .mockReturnValue({ affectedRows: 1, insertId: 1 });
      keyModel.createFreeKey = jest.fn().mockReturnValue({});
      keyModel.add = jest.fn().mockReturnValue(Promise.resolve());
      bcrypt.hashSync = jest.fn().mockReturnValue("");
      request(app)
        .post("/register")
        .send({ email: "abc", password: "abc" })
        .then(response => {
          // -----------------------------------------------
          expect(userModel.findByEmail).toHaveBeenCalled();
          expect(bcrypt.hashSync).toHaveBeenCalled();
          expect(userModel.add).toHaveBeenCalled();
          expect(keyModel.createFreeKey).toHaveBeenCalled();
          expect(keyModel.add).toHaveBeenCalled();
          // -----------------------------------------------
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
  });
});
