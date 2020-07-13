const express = require("express");
const router = express.Router();
const QRCodeController = require("../controllers/qrcode.controller");

router.post("/absensi", QRCodeController.generate);

module.exports = router;
