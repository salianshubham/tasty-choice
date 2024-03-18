const express = require("express");
const router = express.Router();
const { login, signUp, SplashScreen, addDishToMenu, home, addToCart,Cart ,PlaceOrder} = require("../controllers/auth-controllers")



router.route("/login").post(login)
router.route("/sign-up").post(signUp)
router.route("/home").get(home)
router.route("/").get(SplashScreen)
router.route("/add-dish-to-menu").post(addDishToMenu)
router.route("/home-cart").post(addToCart)
router.route("/place-order").post(PlaceOrder)
router.route("/cart").get(Cart)

module.exports = router;