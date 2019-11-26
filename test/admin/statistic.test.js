const request = require("supertest");
const app = require("../../app");
const mockUser = require("../__mock__/user");
const loginDTO = { email: "test@test", password: "123456" };
const userModel = require("../../model/user.model");
const keyModel = require("../../model/key.model");
const bcrypt = require("bcrypt");
const accessControlModel = require("../../model/accessControl.model");
let cookie = "";
beforeAll(async () => {
  bcrypt.compareSync = jest.fn().mockReturnValue(true);
  userModel.findByEmail = jest
    .fn()
    .mockReturnValue(Promise.resolve([{ ...mockUser, role: "admin" }]));
  await request(app)
    .post("/login")
    .send(loginDTO)
    .then(response => {
      cookie = response.header["set-cookie"][0];
    });
});
const mockData = [
  { year: 2019, month: 1, access: 10 },
  { year: 2019, month: 2, access: 15 },
  { year: 2019, month: 3, access: 35 },
  { year: 2019, month: 4, access: 100 },
  { year: 2019, month: 5, access: 150 },
  { year: 2019, month: 6, access: 50 },
  { year: 2019, month: 7, access: 20 },
  { year: 2019, month: 8, access: 11 },
  { year: 2019, month: 9, access: 60 },
  { year: 2019, month: 10, access: 70 },
  { year: 2019, month: 11, access: 120 },
  { year: 2019, month: 12, access: 200 }
];
const mockData2 = [
  { total: 320000, name_package: "Month Advance" },
  { total: 20000, name_package: "Week Basic" },
  { total: 80000, name_package: "Week Advance" },
  { total: 150000, name_package: "Month Basic" },
  { total: 2000000, name_package: "Year Basic" },
  { total: 7200000, name_package: "Year Advanced" }
];
describe(" accessmanage", () => {
  describe("Get", () => {
    test("Failed due to code 403", done => {
      request(app)
        .get("/admin/accessmanage")
        .then(res => {
          expect(res.statusCode).toBe(302);
          expect(res.header.location).toBe("/login");
          done();
        });
    });
    test("Success", done => {
      accessControlModel.singleByYearAndMonth = jest
        .fn()
        .mockReturnValue(Promise.resolve(mockData));
      request(app)
        .get("/admin/accessmanage")
        .query({ year: 2019 })
        .set("Cookie", cookie)
        .then(res => {
          expect(accessControlModel.singleByYearAndMonth).toHaveBeenCalledWith(
            "2019"
          );
          expect(res.statusCode).toBe(200);
          done();
        });
    });
  });
});

describe("revenuemanage", () => {
  describe("Get", () => {
    test("Failed due to code 403", done => {
      request(app)
        .get("/admin/revenuemanage")
        .then(res => {
          expect(res.statusCode).toBe(302);
          expect(res.header.location).toBe("/login");
          done();
        });
    });
    test("Success", done => {
      const query = {
        yearByMonth: "1",
        monthByMonth: "1",
        revenueByYear: "2019"
      };
      keyModel.getAllKeyByYear = jest
        .fn()
        .mockReturnValue(Promise.resolve([{ total: 10000 }]));
      keyModel.getAllKeyByYearPackage = jest
        .fn()
        .mockReturnValue(Promise.resolve(mockData2));
      request(app)
        .get("/admin/revenuemanage")
        .query(query)
        .set("Cookie", cookie)
        .then(res => {
          expect(keyModel.getAllKeyByYear).toHaveBeenCalledTimes(12);
          expect(keyModel.getAllKeyByYearPackage).toHaveBeenCalledWith(
            query.yearByMonth,
            query.monthByMonth
          );
          expect(res.statusCode).toBe(200);
          done();
        });
    });
  });
});
