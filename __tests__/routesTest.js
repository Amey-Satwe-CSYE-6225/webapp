// app.test.js
const request = require("supertest");
const app = require("../main");

const payload = {
  first_name: "amey",
  last_name: "satwe",
  password: "amey",
  username: "amey.satwe@test.com",
};

describe("GET /healthz", () => {
  it("responds with 200 if db connects", async () => {
    const response = await request(app).get("/healthz");
    expect(response.statusCode).toBe(200);
  });
});

describe("POST /healthz", () => {
  it("responds with schema if user is created successfully", async () => {
    const postResponse = await request(app)
      .post("/v1/user")
      .send(payload)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(postResponse.status).toBe(200);
    const responseBody = postResponse.body;
    const stringToEncode = payload.username + ":" + payload.password;
    const getResponse = await request(app)
      .get("/v1/user/self")
      .set("Authorization", `Basic ${btoa(stringToEncode)}`);
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject(responseBody);
  });
});
