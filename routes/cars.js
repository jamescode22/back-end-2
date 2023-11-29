const express = require("express");
const dbQuery = require("../controllers/mysql");
const router = express.Router();

// Check that there is a valid row in the makes_and_models table with the passed id.
const checkValidID = async (id) => {
  try {
    const _car = await dbQuery(`SELECT * FROM makes_and_models WHERE id=${Number(id)}`);
    if (_car && _car.length === 0) {
      throw new Error("Row not found.", { cause: { httpCode: 404 } });
    }
  } catch (e) {
    // rethrow the error
    throw e;
  }
};

// GET / - return all cars

router.get("/", async (req, res) => {
  try {
    const _cars = await dbQuery("SELECT * FROM makes_and_models");
    res.json(_cars);
  } catch (e) {
    res.status(e?.cause?.httpCode || 500).send(e.message);
  }
});

// GET /id - return the car with id matching parameter
router.get("/:carId", async (req, res) => {
  try {
    const id = Number(req.params.carId);

    await checkValidID(id);
    const _car = await dbQuery(`SELECT * FROM makes_and_models WHERE id=${id}`);
    res.json(_car[0]);
  } catch (e) {
    res.status(e?.cause?.httpCode || 500).send(e.message);
  }
});

// POST - takes a JSON object with make and model and
// adds to the array.  Creates a new random ID.
router.post("/", async (req, res) => {
  try {
    const { make, model } = req.body;

    // Validata data
    if (!make || !model) throw new Error("Missing data", { cause: { httpCode: 400 } });
    if (make.length >= 255 || model.length >= 255)
      throw new Error("Invalid data", { cause: { httpCode: 400 } });

    // check for duplicate
    const _car = await dbQuery(
      `SELECT * FROM makes_and_models WHERE make LIKE '${make}' AND model LIKE '${model}'`
    );
    if (_car && _car.length > 0) throw new Error("Duplicate data", { cause: { httpCode: 400 } });

    await dbQuery(
      `INSERT INTO makes_and_models (id, make, model) VALUES (NULL, '${make}', '${model}')`
    );

    return res.sendStatus(201);
  } catch (e) {
    res.status(e?.cause?.httpCode || 500).send(e.message);
  }
});

// PUT - takes a JSON object with id, make and model and updates
// the record.
router.put("/:carId", async (req, res) => {
  try {
    const id = Number(req.params.carId);
    const { make, model } = req.body;

    if (!make || !model || !id) throw new Error("Missing data", { cause: { httpCode: 400 } });

    await checkValidID(id);
    await dbQuery(
      `UPDATE makes_and_models SET make = '${make}', model = '${model}' WHERE id = ${id}`
    );
    return res.sendStatus(201);
  } catch (e) {
    res.status(e?.cause?.httpCode || 500).send(e.message);
  }
});

// DELETE
router.delete("/:carId", async (req, res) => {
  try {
    const id = Number(req.params.carId);
    await checkValidID(id);
    await dbQuery(`DELETE FROM makes_and_models WHERE id = ${id}`);
    return res.sendStatus(200);
  } catch (e) {
    res.status(e?.cause?.httpCode || 500).send(e.message);
  }
});

module.exports = router;
