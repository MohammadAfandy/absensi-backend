const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const response = require("./utils/response");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

connectDb();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const absensiRoute = require("./routes/absensi.route");
app.use("/absensi", absensiRoute);

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`app running on port ${port}`)
);

// error handler
app.use((err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).json(
    response({
      status: err.statusCode,
      message: "Internal server error",
      error: err.message,
    })
  );
});

// Find 404
app.use((req, res, next) => {
  if (res.data) {
    return next();
  } else {
    res.status(404).json(
      response({
        status: 404,
        message: "Route Not Found",
        error: "Route Not Found",
      })
    );
  }
});

// response handler
app.use((req, res, next) => {
  res.json(
    response({
      status: res.statusCode,
      message: res.message || "Success",
      data: res.data || null,
    })
  );
});

// Static build location
app.use(express.static(path.join(__dirname, "dist")));
