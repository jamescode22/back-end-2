const express = require("express");
const cars = require("./routes/cars");
const app = express();

const PORT = process.env.PORT || 3333;

// load body JSON into req.body
app.use(express.json());

// route for /cars
app.use("/cars", cars);

// start the server
app.listen(PORT, () => {
  console.log(`Server is listening on post ${PORT}`);
});
