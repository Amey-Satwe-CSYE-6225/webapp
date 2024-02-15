const request = require("supertest");
const app = require("../main");

const payload = {
  first_name: "amey",
  last_name: "satwe",
  password: "amey",
  username: "amey.satwe@test.com",
};

const comparisonAfterPost = {
  first_name: "amey",
  last_name: "satwe",
  username: "amey.satwe@test.com",
};

const putPayload = {
  first_name: "AmeyAfterPut",
  last_name: "satwe",
  password: "amey",
};

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
    const body = getResponse.body;
    delete body.id;
    delete body.account_created;
    delete body.account_updated;
    const compare_payload = payload.password;
    expect(body).toStrictEqual(comparisonAfterPost);
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
    delete getResponse.body.account_created;
    delete getResponse.body.account_updated;
    delete getResponse.body.id;
    delete getResponse.body.username;
    expect(getResponse.body).toStrictEqual(putPayload);
  });
});
