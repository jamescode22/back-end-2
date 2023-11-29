const express = require("express");
const router = express.Router();

const cars = [
  { id: 2323, make: "skoda", model: "octavia" },
  { id: 5542, make: "ford", model: "fiesta" },
  { id: 3464, make: "volkswagen", model: "golf" },
];

// routes for /cars

// GET / - return all cars
router.get("/", (req, res) => {
  res.json(cars);
});

// GET /id - return the car with id matching parameter
router.get("/:carId", (req, res) => {
  const _car = cars.find((car) => car.id === Number(req.params.carId));
  if (!_car) return res.sendStatus(404);
  res.json(_car);
});

// POST - takes a JSON object with make and model and
// adds to the array.  Creates a new random ID.
router.post("/", (req, res) => {
  const { make, model } = req.body;
  // if missing data, quit
  if (!make || !model) return res.status(400).send("missing data");

  // check for duplicates
  if (cars.findIndex((car) => car.make === make && car.model === model) !== -1)
    return res.status(400).send("duplicate data");

  cars.push({ id: Math.round(Math.random() * 10000), make, model });
  return res.sendStatus(201);
});

// PUT - takes a JSON object with id, make and model and updates
// the record.
router.put("/:carsId", (req, res) => {
  const { carsId } = req.params;
  const { make, model } = req.body;

  if (!make || !model || !carsId) return res.status(400).send("missing data");

  // get the index of this car
  const _carIndex = cars.findIndex((car) => car.id === Number(carsId));

  if (_carIndex === -1) return res.sendStatus(404);

  // do the update
  cars[_carIndex].make = make;
  cars[_carIndex].model = model;
  return res.sendStatus(201);
});

// DELETE
router.delete("/:carId", (req, res) => {
  const { carId } = req.params;
  const _carIndex = cars.findIndex((car) => car.id === Number(carId));

  if (_carIndex === -1) return res.sendStatus(404);

  // do the deletion
  cars.splice(_carIndex, 1);
  return res.sendStatus(200);
});

module.exports = router;
