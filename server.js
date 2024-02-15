const app = require("./main.js");
const sequelize = require("./models/sequelize.js");

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
