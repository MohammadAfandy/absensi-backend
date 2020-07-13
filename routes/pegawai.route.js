const express = require("express");
const router = express.Router();
const PegawaiController = require("../controllers/pegawai.controller");

router.get("/", PegawaiController.find);
router.post("/", PegawaiController.store);
router.get("/:id", PegawaiController.findOne);
router.delete("/:id", PegawaiController.destroy);

module.exports = router;
