const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/register", AuthController.store);
router.post("/login", AuthController.login);
router.post("/token", AuthController.refreshToken);
router.post("/logout", AuthController.logout);

module.exports = router;
