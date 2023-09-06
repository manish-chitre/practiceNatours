const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("./models/TourModel");

dotenv.config({path: "./config.env"});

let db = process.env.DATABASE_CONNECTION.replace(
  "<username>",
  process.env.DATABASE_USERNAME
);

db = db.replace("<password>", process.env.DATABASE_PASSWORD);

console.log(db);

mongoose.connect(db).then((con) => {
  //console.log(con.connection);
  console.log("database has been successfully connected");
});

let tours = fs.readFileSync(`${__dirname}/dev-data/tours-simple.json`, "utf-8");

importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    console.log("successfully inserted all tours..");
  } catch (err) {
    console.log(err);
  }
};

deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log("successfully deleted all tours");
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

console.log(process.argv);
