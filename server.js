const app = require("./main.js");
const sequelize = require("./models/sequelize.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
