// app.test.js
const request = require("supertest");
const app = require("../main");

const payload = {
  first_name: "amey",
  last_name: "satwe",
  password: "amey",
  username: "amey.satwe@test.com",
};

const putPayload = {
  first_name: "AmeyAfterPut",
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
      .expect(201);
    const responseBody = postResponse.body;
    const stringToEncode = payload.username + ":" + payload.password;
    const getResponse = await request(app)
      .get("/v1/user/self")
      .set("Authorization", `Basic ${btoa(stringToEncode)}`);
    expect(getResponse.status).toBe(200);
    // console.log(getResponse.body);
    expect(getResponse.body).toMatchObject(responseBody);
  });
});

describe("PUT /healthz", () => {
  it("Get updated schema from the request", async () => {
    const stringToEncode = payload.username + ":" + payload.password;
    const putResponse = await request(app)
      .put("/v1/user/self")
      .send(putPayload)
      .set("Authorization", `Basic ${btoa(stringToEncode)}`)
      .expect(204);
    // const stringToEncode = payload.username + ":" + payload.password;
    const getResponse = await request(app)
      .get("/v1/user/self")
      .set("Authorization", `Basic ${btoa(stringToEncode)}`);
    expect(getResponse.status).toBe(200);
    console.log("get body from put" + getResponse.body);
    delete putPayload.password;
    console.log(getResponse.body);
    expect(getResponse.body).toMatchObject(putPayload);
  });
});
