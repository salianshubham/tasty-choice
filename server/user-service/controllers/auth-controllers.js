const User = require("../models/user-models")
const bcrypt = require("bcryptjs")
const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userExists = await User.findOne({ email })


        if (!userExists) {
            return res.status(400).send({ message: "Invalid Credentials" })
        }

        const checkPassword = await bcrypt.compare(password, userExists.password);
        if (checkPassword) {

            res.status(200).send(
                {
                    message: "LogIn successfully.",
                    token: await userExists.generateToken(),// created a function of jwt token
                    userId: userExists._id.toString()
                })
        } else {
            res.status(401).send({ message: "Invalid Credentials" })
        }

    } catch (error) {
        console.log(error)
        res.status(400).send("Page not found")
    }
}

const signUp = async (req, res) => {
    try {
        const { username, phone, email, password } = req.body;

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(400).json({ msg: "Email already exists. please login" })
        }

        const saltRound = 10;//it is used to hash the password for 10 times more stronger
        const hash_password = await bcrypt.hash(password, saltRound)

        const userCreated = await User.create({ username: username, phone: phone, email: email, password: hash_password })
        res.status(200).send(
            {
                message: "Data saved successfully.",
                token: await userCreated.generateToken(),// created a function of jwt token
                userId: userCreated._id.toString()
            })
    } catch (error) {
        console.log(error)
        res.status(400).send("sign up Page Not Found")
    }
}

const SplashScreen = async (req, res) => {
    try {
        res.status(200).send({
            msg: "splash screen"
        })
    } catch (error) {
        console.log(error)
        res.status(400).send("sign up Page Not Found")
    }
}

const addDishToMenu = async (req, res) => {
    try {
        console.log(req.file)
        // res.status(200).send({
        //     msg: "all right",
        //     data: req.file
        // })
    } catch (error) {
        console.log(error)
    }
}


module.exports = { login, signUp, SplashScreen, addDishToMenu }