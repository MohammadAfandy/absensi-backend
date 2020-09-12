const dotenv = require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoute = require("./routes/auth.route");
const pegawaiRoute = require("./routes/pegawai.route");
const absensiRoute = require("./routes/absensi.route");
const qrCodeRoute = require("./routes/qrcode.route");
const responseHandler = require("./middleware/responseHandler");
const jwtAuth = require("./middleware/jwtAuth");

require("./config/db")();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1/auth", authRoute);

app.use("/api/v1/pegawai", jwtAuth, pegawaiRoute);
app.use("/api/v1/absensi", jwtAuth, absensiRoute);
app.use("/api/v1/qrcode", qrCodeRoute);

app.use(...responseHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () =>
  console.log(`🚀 running on port ${port}`)
);
