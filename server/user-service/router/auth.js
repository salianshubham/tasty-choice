const express = require("express");
const router = express.Router();
const { login, signUp } = require("../controllers/auth-controllers")



router.route("/login").post(login)
router.route("/sign-up").post(signUp)

module.exports = router;