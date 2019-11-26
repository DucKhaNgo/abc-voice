const request = require("supertest");
const app = require("../../app");
const keyModel = require("../../model/key.model");
const req = require("request");
beforeAll(() => {
  keyModel.searchKey = jest.fn();
});

describe("Test api", () => {
  test("Post file  wrong type", done => {
    request(app)
      .post("/api")
      .field("apiKey", "abc")
      .attach("myFile", `${__dirname}/../../audio/test.txt`)
      .then(res => {
        expect(res.statusCode).toBe(400);
        done();
      });
  });
  test("Post file  wrong apiKey", done => {
    const field = {
      name: "apiKey",
      value: "abc"
    };
    keyModel.searchKey.mockReturnValue(Promise.resolve([{ valid: 0 }]));
    request(app)
      .post("/api")
      .field(field.name, field.value)
      .attach("myFile", `${__dirname}/../../audio/test.wav`)
      .then(res => {
        expect(res.statusCode).toBe(400);
        expect(keyModel.searchKey).toHaveBeenCalledWith(field.value);
        done();
      });
  });
  test("Dont post file ", done => {
    const field = {
      name: "apiKey",
      value: "abc"
    };
    keyModel.searchKey.mockReturnValue(Promise.resolve([{ valid: 1 }]));
    request(app)
      .post("/api")
      .field(field.name, field.value)
      .then(res => {
        expect(res.statusCode).toBe(400);
        done();
      });
  });
});
