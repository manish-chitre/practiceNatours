const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("./models/TourModel");
const User = require("./models/UserModel");
const Review = require("./models/ReviewModel");

dotenv.config({ path: "./config.env" });

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

let tours = fs.readFileSync(`${__dirname}/dev-data/tours.json`, "utf-8");
let users = fs.readFileSync(`${__dirname}/dev-data/users.json`, "utf-8");
let reviews = fs.readFileSync(`${__dirname}/dev-data/reviews.json`, "utf-8");

importData = async () => {
  try {
    await Tour.create(JSON.parse(tours));
    await User.create(JSON.parse(users));
    await Review.create(JSON.parse(reviews));
    console.log("successfully inserted all tours..");
  } catch (err) {
    console.log(err);
  }
};

deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
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
