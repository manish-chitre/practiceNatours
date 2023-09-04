const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({path: "./config.env"});

const server = app.listen(process.env.PORT, () => {
  console.log(`server has started listening on ${process.env.PORT}`);
});
