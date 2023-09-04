const fs = require("fs");

const data = fs.readFileSync(`.\\dev-data\\tours-simple.json`, "utf-8");

let tours = JSON.parse(data);

exports.checkId = (req, res, next, value) => {
  if (value > tours.length) {
    return res.status(404).json({status: "failed", message: "not valid id"});
  }
  next();
};

exports.createTour = (req, res) => {
  if (!req.body)
    return res
      .status(404)
      .json({status: "failed", message: "unable to create tour"});

  tours.push(req.body);

  return res.status(200).json({status: "success", data: tours});
};

exports.getTour = (req, res) => {
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
};

exports.getTours = (req, res) => {
  console.log("I am in all tours");
  return res.status(200).json({status: "success", data: tours});
};

exports.updateTour = (req, res) => {
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
};

exports.deleteTour = (req, res) => {
  let id = req.params.id;
  let tour = tours.find((tour) => tour.id == id);
  if (!tour) {
    return res
      .status(404)
      .json({status: "failed", message: "sorry id is not found"});
  }

  tours = tours.filter((tour) => tour.id != id);

  fs.writeFileSync(
    `${__dirname}\\dev-data\\tours-simple.json`,
    JSON.stringify(tours),
    "utf-8"
  );

  return res.status(200).json({status: "success", data: tours});
};
