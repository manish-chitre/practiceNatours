const express = require("express");
const app = express();
const fs = require("fs");

app.use(express.json());

if (process.env.NODE_ENV == "development") app.use(morgan("dev"));

const data = fs.readFileSync(
  `${__dirname}\\dev-data\\tours-simple.json`,
  "utf-8"
);

let tours = JSON.parse(data);

app.get("/api/v1/tours", (req, res) => {
  return res.status(200).json({status: "success", data: tours});
});

app.get("/api/v1/tours/:id", (req, res) => {
  let id = req.params.id;

  if (id > tours.length) {
    return res.status(404).json({
      status: "failed",
      message: "tour id is not present int the tour database",
    });
  }
  let tour = tours[id];

  return res
    .status(200)
    .json({status: "success", count: tours.length, data: tour});
});

app.post("/api/v1/tours", (req, res) => {
  let body = req.body;
  let id = tours.length;
  let newTour = Object.assign({id: id}, body);
  tours.push(newTour);
  fs.writeFileSync(
    `${__dirname}\\dev-data\\tours-simple.json`,
    JSON.stringify(tours),
    "utf-8"
  );
  return res
    .status(201)
    .json({status: "success", count: tours.length, data: tours});
});

app.delete("/api/v1/tours/:id", (req, res) => {
  let id = req.params.id;
  let tour = tours.find((tour) => tour.id == id);
  if (!tour) {
    return res
      .status(404)
      .json({status: "failed", message: "sorry id is not found"});
  }

  tours = tours.filter((tour) => tour.id != id);
  console.log(tours);
  fs.writeFileSync(
    `${__dirname}\\dev-data\\tours-simple.json`,
    JSON.stringify(tours),
    "utf-8"
  );

  return res.status(200).json({status: "success", data: tours});
});

app.patch("/api/v1/tours/:id", (req, res) => {
  let id = req.params.id;
  let modifiedTour = req.body;

  tour = tours.find((tour) => tour.id == id);

  if (!tour)
    return res
      .status(404)
      .json({status: "fail", message: "id is not present in the database"});

  tours[tours.findIndex((tour) => tour.id == id)] = modifiedTour;

  fs.writeFileSync(
    `${__dirname}\\dev-data\\tours-simple.json`,
    JSON.stringify(tours),
    "utf-8"
  );

  return res.status(200).json({status: "success", data: tours});
});

module.exports = app;
