const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION Shutting down..");
  console.log(err);
  process.exit(1);
});

let db = process.env.DATABASE_CONNECTION.replace(
  "<username>",
  process.env.DATABASE_USERNAME
);

db = db.replace("<password>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(db)
  .then((con) => {
    // console.log(con.connection);
    console.log("connected successfully");
  })
  .catch((err) => console.log(err));

const server = app.listen(process.env.PORT, () => {
  console.log(`server has started listening on ${process.env.PORT}`);
});

//promise rejection event is emitted and is caughted.
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLER REJECTION Shutting down..");
  server.close(() => {
    process.exit(1);
  });
});

//console.log(x);
