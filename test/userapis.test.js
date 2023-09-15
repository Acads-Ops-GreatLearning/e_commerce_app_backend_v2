const chai = require("chai");
const expect = chai.expect;
const request = require("supertest");
const { app } = require("../server");
const UserModel = require("../app/models/userModel");
const UserSessionModel = require("../app/models/userSessionModel");
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

var sessionToken;

describe("User Apis Test", () => {
  before(async () => {
    console.log('Inside User test suite')
    console.log = function () {};
    console.error = function () {};
    await UserModel.deleteMany();
    await UserSessionModel.deleteMany();
  });

  after(async () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  const testUser = {
    username: "testuser",
    fullname: "Test User",
    email: "test@example.com",
    password: "testpassword",
    isAdmin: true,
  };

  describe("POST /api/v1/users/", async () => {
    it("should add a new user", async () => {
      const res = await request(app).post("/api/v1/users").send(testUser);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("User is successfully registered");
    });
    it("should not add a user with an existing username", async () => {
      const res = await request(app).post("/api/v1/users").send(testUser);

      expect(res.status).to.equal(400);
      expect(res.body.error).to.equal("User already exists");
    });
  });

  describe("POST /api/v1/users/login", async () => {
    it("should be able to perform the login action", async () => {
      let credentials = {
        username: "testuser",
        password: "testpassword",
      };
      const res = await request(app).post("/api/v1/users/login").send(credentials);

      expect(res.status).to.equal(200);
      const userData = res.body.userData;
      sessionToken = userData.sessionToken;
      expect(userData.username).to.equal("testuser");
      expect(userData.sessionToken).to.be.an("string");
    });
  });

  describe("GET /api/v1/users", function () {
    it("should return 200 OK with users", async function () {
      const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const users = response.body.users;
      expect(users).to.be.an("array");
      expect(users).length.greaterThanOrEqual(0);
    });

    it("should have valid users", async function () {
      const response = await request(app)
        .get("/api/v1/users/")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-type", /json/);

      const users = response.body.users;
      expect(users).have.length.greaterThanOrEqual(0);
      expect(users).to.be.an("array");

      users.forEach((user) => {
        expect(user.fullname).to.be.an("string");
        expect(user.username).to.be.an("string");
        expect(user.isAdmin).to.be.an("boolean");
      });
    });
  });

  describe('GET /api/users/logout', async function() {
    it('should return 200 after logout', async function() {
        const response = await request(app)
        .post("/api/v1/users/logout")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/);
    })
  })
});

module.exports = sessionToken;