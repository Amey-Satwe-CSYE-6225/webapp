import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
const app = express();
const port = 3000;

import sequelize from "./models/sequelize.js";
import User from "./models/userModel.js";

app.use(express.json());

const saltRounds = 20;

app.use((req, res, next) => {
  console.log("headers MW");
  res.set("cache-control", "no-cache,no-store,must-revalidate");
  next();
});

app.use("/healthz", (req, res, next) => {
  console.log("Params MW");
  if (
    req.get("Content-type") ||
    Object.keys(req.body).length > 0 ||
    Object.keys(req.query).length > 0
  ) {
    res.status(400).send();
  } else {
    next();
  }
});

app.use("/healthz", (req, res, next) => {
  console.log("method MW");
  if (req.method != "GET") {
    res.status(405).send();
  } else {
    next();
  }
});

app.get("/healthz", (req, res, next) => {
  console.log("Here");
  sequelize
    .authenticate()
    .then(() => {
      return res.status(200).send();
    })
    .catch((error) => {
      return res.status(503).send();
    });
});

app.post("/v1/user", async (req, res, next) => {
  console.log("Posting to user");
  // Create a new user

  let body = req.body;
  let firstName = body.first_name;
  let lastName = body.last_name;
  let password = body.password;
  let userName = body.username;

  const hashedPwd = await bcrypt.hash(password, 10);
  console.log(`Hashed password is ${hashedPwd}`);
  try {
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      password: hashedPwd,
      username: userName,
    });
    console.log(`${user.first_name}'s auto-generated ID:, ${user.id}`);

    return res.status(201).send();
  } catch (e) {
    console.log(e);
    return res.status(400).send();
  }
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

// export default app;
