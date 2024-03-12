const express = require("express");
const router = express.Router();
const { login, signUp,SplashScreen,addDishToMenu} = require("../controllers/auth-controllers")



router.route("/login").post(login)
router.route("/sign-up").post(signUp)
router.route("/").get(SplashScreen)
router.route("/add-dish-to-menu").post(addDishToMenu)

module.exports = router;