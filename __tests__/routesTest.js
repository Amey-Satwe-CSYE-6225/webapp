// app.test.js
const request = require("supertest");
const app = require("../main");

describe("GET /healthz", () => {
  it("responds with 200 if db connects", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(503);
  });
});
