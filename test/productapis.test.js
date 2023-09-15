const chai = require("chai");
const request = require("supertest");

const expect = chai.expect;
const { app } = require("../server");
const ProductModel = require("../app/models/productModel");
const CategoryModel = require("../app/models/categoryModel");

const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe("Product APIs Tests", function () {
  var sessionToken;
  var category;
  var testProduct;
  before(async () => {
    console.log = function () {};
    console.error = function () {};

    ProductModel.deleteMany();

    let credentials = {
      username: "testuser",
      password: "testpassword",
    };

    const res = await request(app).post("/api/v1/users/login").send(credentials);

    sessionToken = res.body.userData.sessionToken;
    console.log("Token Generated", sessionToken);

    category = await CategoryModel.findOne({ isActive: true });
  });

  after(async () => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  describe("POST /api/v1/products/", () => {
    it("should add a new product", async () => {
      const testProduct = {
        name: "test product",
        description: "test product description",
        price: 100,
        quantityInStock: 100,
        image: "test product image path",
        categoryId: category._id,
      };
      const res = await request(app)
        .post("/api/v1/products/")
        .set("Authorization", `Bearer ${sessionToken}`)
        .send(testProduct);

      expect(res.status).to.equal(201);
      expect(res.body.message).to.equal("Product created successfully");
    });

    it("should return 401 incase token is not provided in request", async () => {
      const testProduct = {
        name: "test product",
        description: "test product description",
        price: 100,
        quantityInStock: 100,
        image: "test product image path",
        categoryId: category._id,
      };
      const res = await request(app).post("/api/v1/products/").send(testProduct);
      expect(res.status).to.equal(401);
    });
  });
  describe("GET /api/v1/products", () => {
    it("should return 200 OK with products", async function () {
      const response = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-Type", /json/);

      const products = response.body.products;
      expect(products).to.be.an("array");
      expect(products).length.greaterThanOrEqual(0);
    });

    it("should have valid products", async function () {
      const response = await request(app)
        .get("/api/v1/products/")
        .set("Authorization", `Bearer ${sessionToken}`)
        .expect(200)
        .expect("Content-type", /json/);

      const products = response.body.products;
      expect(products).have.length.greaterThanOrEqual(0);
      expect(products).to.be.an("array");

      products.forEach((product) => {
        expect(product.name).to.be.an("string");
        expect(product.description).to.be.an("string");
        expect(product.image).to.be.an("string");
      });
    });
  });
});
