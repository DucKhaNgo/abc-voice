const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const loginDTO = { email: "test@test", password: "123456" };
const bcrypt = require("bcrypt");
const userModel = require("../../model/user.model");
const keyModel = require("../../model/key.model");
let cookie = "";
const mockReturnValue = Promise.resolve([mockUser]);
const mockKey = {
  id_package: 0,
  user_id: 1,
  date_start: new Date(),
  valid: true,
  value: "",
  price: 0,
  date_expired: new Date(),
  name_package: "Free",
  transactionId: null,
  term: 0
};
beforeAll(async () => {
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  userModel.findByEmail = jest.fn().mockReturnValue(mockReturnValue);
  await request(app)
    .post("/login")
    .send(loginDTO)
    .then(response => {
      cookie = response.header["set-cookie"][0];
    });
});

describe("Test profile page", () => {
  describe("Get", () => {
    test("Get /profile failed", done => {
      request(app)
        .get("/profile")
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/login");
          done();
        });
    });
    test("Get /profile success", done => {
      keyModel.getKeyById = jest.fn().mockReturnValue(Promise.resolve([]));
      request(app)
        .get("/profile")
        .set("Cookie", cookie)
        .then(response => {
          expect(keyModel.getKeyById).toHaveBeenCalled();

          expect(response.statusCode).toBe(200);

          done();
        });
    });
  });
  describe("Post", () => {
    test("Post /profile/updatekey", done => {
      keyModel.singleById = jest
        .fn()
        .mockReturnValue(Promise.resolve([mockKey]));
      keyModel.update = jest.fn();
      request(app)
        .post("/profile/updatekey")
        .set("Cookie", cookie)
        .send({ id: 1 })
        .then(response => {
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/profile");
          done();
        });
    });
    test("Post /profile/renewkey", done => {
      keyModel.singleById = jest.fn().mockReturnValue([mockKey]);
      keyModel.update = jest.fn();
      request(app)
        .post("/profile/renewkey")
        .set("Cookie", cookie)
        .send({ idKey: 1 })
        .then(response => {
          expect(keyModel.singleById).toHaveBeenCalled();
          expect(keyModel.update).toHaveBeenCalled();

          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/profile");
          done();
        });
    });
    test("Post /profile", done => {
      userModel.update = jest.fn();
      request(app)
        .post("/profile")
        .set("Cookie", cookie)
        .send({ name: "newName" })
        .then(response => {
          expect(userModel.update).toHaveBeenCalledWith({
            ...mockUser,
            name: "newName"
          });
          expect(response.statusCode).toBe(302);
          expect(response.header.location).toBe("/profile");
          done();
        });
    });
  });
});
