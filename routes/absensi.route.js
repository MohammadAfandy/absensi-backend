const express = require("express");
const router = express.Router();
const AbsensiControler = require("../controllers/absensi.controller");

router.get("/", AbsensiControler.find);
router.get("/inout", AbsensiControler.inOut);
router.get("/:id", AbsensiControler.findOne);

module.exports = router;
