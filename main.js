const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const { body, validationResult } = require("express-validator");

const sequelize = require("./models/sequelize.js");
const User = require("./models/userModel.js");
const winston = require("winston");
const format = winston.format;
const logger = winston.createLogger({
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    process.env.ENVIRONMENT === "PRODUCTION"
      ? new winston.transports.File({ filename: `/var/log/webapp/app.log` })
      : new winston.transports.Console(),
  ],
});

const postschema = [
  body("username").isEmail().isLength({ min: 1 }),
  body("first_name").isString().isLength({ min: 1 }),
  body("last_name").isString().isLength({ min: 1 }),
  body("password").isAlphanumeric().isLength({ min: 1 }),
];

const putschema = [
  body("first_name").isString().isLength({ min: 1 }),
  body("last_name").isString().isLength({ min: 1 }),
  body("password").isAlphanumeric().isLength({ min: 1 }),
];

const validateSchema = (req, res, next) => {
  const errors = validationResult(req);
  const allowedFields =
    req.method === "POST"
      ? ["username", "first_name", "last_name", "password"]
      : ["first_name", "last_name", "password"];
  console.log(allowedFields);
  const requestFields = Object.keys(req.body);
  const extraFields = requestFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (extraFields.length > 0) {
    logger.error("Invalid fields in put request");
    return res.status(400).json({ errors: "Invalid fields in put request" });
  }

  if (!errors.isEmpty()) {
    logger.error("Please check fields for validation errors");
    return res
      .status(400)
      .json({ errors: "Please check fields for validation errors" });
  }
  next();
};

app.use(express.json());

const saltRounds = 10;

app.use((req, res, next) => {
  // console.log("headers MW");
  logger.info("Parsing headers");
  res.set("cache-control", "no-cache,no-store,must-revalidate");
  next();
});

app.use("/healthz", (req, res, next) => {
  logger.info("parsing for query params and body");
  if (
    req.get("Content-type") ||
    Object.keys(req.body).length > 0 ||
    Object.keys(req.query).length > 0
  ) {
    logger.error("Check request with docs");
    return res.status(400).send();
  } else {
    next();
  }
});

app.use("/healthz", (req, res, next) => {
  // console.log("method MW");
  logger.info("methods MW");
  if (req.method != "GET") {
    logger.error("Wrong method used on /healthz");
    return res.status(405).send();
  } else {
    next();
  }
});

app.get("/healthz", (req, res, next) => {
  // console.log("Here");
  sequelize
    .authenticate()
    .then(() => {
      logger.info("DB connected and no errors");
      return res.status(200).send();
    })
    .catch((error) => {
      logger.error(`DB not connected with the following error:${error}`);
      return res.status(503).send();
    });
});

const checkDBMiddleWare = async (req, res, next) => {
  try {
    await sequelize.authenticate();
    logger.info("DB connected and no errors");
    next();
  } catch (err) {
    // console.log("Db connection didn't work");
    logger.error(`DB not connected with the following error:${err}`);
    return res.status(503).send();
  }
};

app.use(checkDBMiddleWare);

app.use((req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    logger.error(`Query params used in request. Please change request URL`);
    return res.status(400).send();
  } else {
    next();
  }
});

app.post("/v1/user", postschema, validateSchema, async (req, res, next) => {
  // console.log("Posting to user");
  // Create a new user
  logger.info("Creating new user on POST");
  let body = req.body;
  let firstName = body.first_name;
  let lastName = body.last_name;
  let password = body.password;
  let userName = body.username;

  const hashedPwd = await bcrypt.hash(password, saltRounds);
  // console.log(`Hashed password is ${hashedPwd}`);
  try {
    const user = await User.create({
      first_name: firstName,
      last_name: lastName,
      password: hashedPwd,
      username: userName,
    });
    const responseUser = await User.findOne({
      where: {
        username: userName,
      },
      attributes: { exclude: ["password"] },
    });
    // console.log("helloooooo");
    logger.info("User created successfully");
    return res.status(201).json(responseUser);
    // return res.status(204).send();
  } catch (e) {
    // console.log(e);
    logger.error(`User creation errored with the following error:${e}`);
    return res.status(400).send();
  }
});

const authMiddleWare = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.error("Authorization failed. Please check credentials");
    return res.status(401).send();
  } else {
    return next();
  }
};

app.use("/v1/user/self", authMiddleWare);

app.get("/v1/user/self", async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (Object.keys(req.body).length > 0) {
    logger.error("bad req for body");
    return res.status(400).send();
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
    logger.error("User not found");
    return res.status(400).send();
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
    logger.info("Found user");
    res.json(responseUser).status(200).send();

    // return res.status(200).send();
  }
  logger.error("Unauthorized call to GET");
  return res.status(401).send();
});

app.put("/v1/user/self", putschema, validateSchema, async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const decodedString = atob(authHeader.split(" ")[1]).split(":");
  const username = decodedString[0];
  const password = decodedString[1];
  const currentUser = await User.findOne({
    where: {
      username: username,
    },
  });
  if (!currentUser) {
    logger.error("User not found");
    return res.status(400).send();
  }
  const isValidUser = await bcrypt.compare(password, currentUser.password);
  if (currentUser && !isValidUser) {
    logger.error("User authorization failed");
    return res.status(401).send();
  }
  let body = req.body;
  let firstName = body.first_name;
  let lastName = body.last_name;
  let updatedPassword = body.password;
  const hashedPwd = await bcrypt.hash(updatedPassword, saltRounds);
  // console.log("here");
  try {
    currentUser.set({
      first_name: firstName,
      last_name: lastName,
      password: hashedPwd,
    });
    // console.log("After set");
    logger.info("User updated");
    await currentUser.save();
    return res.status(204).send();
  } catch (err) {
    // console.log(err);
    logger.error(`User update failed with the error:${err}`);
    return res.status(400).send();
  }
});

sequelize
  .sync()
  .then(() => {
    logger.info("Database synced successfully");
    // console.log("Database synced successfully");
  })
  .catch((error) => {
    logger.error(`Error syncing database:${error}`);
  });

app.use("/", (req, res, next) => {
  return res.status(404).send();
});
// app.listen(3000, () => console.log(`Listening on port: 3000`));

module.exports = app;
