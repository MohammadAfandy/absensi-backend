const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./config/db");
const dotenv = require("dotenv");
const pegawaiRoute = require("./routes/pegawai.route");
const absensiRoute = require("./routes/absensi.route");
const qrCodeRoute = require("./routes/qrcode.route");
const responseHandler = require("./middleware/responseHandler");

dotenv.config({ path: "./.env" });

connectDb();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/api/v1/pegawai", pegawaiRoute);
app.use("/api/v1/absensi", absensiRoute);
app.use("/api/v1/qrcode", qrCodeRoute);

app.use(...responseHandler);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => console.log(`🚀 running on port ${port}`));
