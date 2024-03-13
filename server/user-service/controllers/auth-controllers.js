const { User, Dish } = require("../models/user-models")
const bcrypt = require("bcryptjs")
const path = require('path');
const multer = require('multer');

const destinationPath = path.join(__dirname, '../../../client/tastychoice/public/images');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, destinationPath); // Set the path to your image folder
    },
    filename: function (req, file, cb) {

        const uniqueSuffix = Date.now() + '-';
        cb(null, file.originalname + '-' + uniqueSuffix + '.jpg'); // Save as jpg, adjust as needed
    }
});
const upload = multer({ storage });
/////////////////////////////////////////////////
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


        upload.single('image')(req, res, async (err) => {
            if (err) {
                console.error('Error uploading image:', err.message);
                return res.status(400).json({ error: 'Error uploading image' });
            }

            const dishName = req.body.dishName;
            const dishPrice = req.body.dishPrice
            const dishCategories = req.body.dishCategories
            const dishImagePath = req.file.path;
            const filename = req.file.filename;
            console.log(req.file)
            const DishCreated = await Dish.create({ dishName: dishName, price: dishPrice, catagories: dishCategories, image: dishImagePath,filename:filename})
            res.status(200).json({
                message: 'Image uploaded successfully',
                filename: req.file.filename,
                path: req.file.path,
                
            });
        })

    } catch (error) {
        console.log(error)
    }
}

const home = async (req, res) => {
    try {
        const dishItems = await Dish.find()
        res.status(200).send(
            {
                message: dishItems,
            })
    } catch (error) {
        console.log(error)
        res.status(400).send("Home Page Not Found")
    }
}

module.exports = { login, signUp, SplashScreen, addDishToMenu,home }