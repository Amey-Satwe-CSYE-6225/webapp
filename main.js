const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const port = 3000;

const sequelize = require("./models/sequelize.js");
const User = require("./models/userModel.js");

app.use(express.json());

const saltRounds = 10;

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

const checkDBMiddleWare = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    next();
  } catch (err) {
    console.log("Db connection didn't work");
    return res.status(503).send();
  }
};

app.use(checkDBMiddleWare);

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
    // console.log(`${user.first_name}'s auto-generated ID:, ${user.id}`);

    return res.status(201).send();
  } catch (e) {
    console.log(e);
    return res.status(400).send();
  }
});

app.get("/v1/user/self", async (req, res, next) => {
  // console.log(atob(req.headers.authorization.split(" ")[1]));
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // let err = new Error("You are not authenticated!");
    res.status(401).send();
  }
  const decodedString = atob(authHeader.split(" ")[1]).split(":");
  const username = decodedString[0];
  const password = decodedString[1];
  const currentUser = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!currentUser) {
    res.status(400).send();
  }
  const isValidUser = await bcrypt.compare(password, currentUser.password);
  if (currentUser && isValidUser) {
    //  console.log("Password Valid, Let request pass");
    const responseUser = await User.findOne({
      where: {
        username: username,
      },
      attributes: { exclude: ["password"] },
    });
    res.json(responseUser);
    res.status(200).send();
  }
  res.status(401).send();
});

app.put("/v1/user/self", async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // let err = new Error("You are not authenticated!");
    res.status(401).send();
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

// app.listen(3000, () => console.log(`Listening on port: 3000`));

module.exports = app;
