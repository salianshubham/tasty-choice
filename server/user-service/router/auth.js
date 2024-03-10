const express = require("express");
const router = express.Router();
const { login, signUp,SplashScreen} = require("../controllers/auth-controllers")



router.route("/login").post(login)
router.route("/sign-up").post(signUp)
router.route("/").get(SplashScreen)

module.exports = router;