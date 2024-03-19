const { User, Dish, AddToCart, PlaceOrder_model } = require("../models/user-models")
const bcrypt = require("bcryptjs")
const path = require('path');
const multer = require('multer');

// const destinationPath = path.join(__dirname, '../../../client/tastychoice/public/images');
const destinationPath = path.join(__dirname, '../../client/tastychoice/public/images');
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

            const DishCreated = await Dish.create({ dishName: dishName, price: dishPrice, categories: dishCategories, image: dishImagePath, filename: filename })
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
        const categories = req.query.categories

        if (categories == "All") {
            const dishItems = await Dish.find()
            res.status(200).send(
                {
                    message: dishItems,
                })
        } else if (categories == "Breakfast") {
            const dishItems = await Dish.find({ categories: "Breakfast" })
            res.status(200).send(
                {
                    message: dishItems,
                })
        } else if (categories == "Dinner") {
            const dishItems = await Dish.find({ categories: "Dinner" })
            res.status(200).send(
                {
                    message: dishItems,
                })
        } else if (categories == "Lunch") {
            const dishItems = await Dish.find({ categories: "Lunch" })
            res.status(200).send(
                {
                    message: dishItems,
                })
        } else if (categories == "Starters") {
            const dishItems = await Dish.find({ categories: "Starters" })
            res.status(200).send(
                {
                    message: dishItems,
                })
        } else if (categories == "Dessert") {
            const dishItems = await Dish.find({ categories: "Dessert" })
            res.status(200).send(
                {
                    message: dishItems,
                })
        }



    } catch (error) {
        console.log(error)
        res.status(400).send("Home Page Not Found")
    }
}

const addToCart = async (req, res) => {
    try {
        const { dishName, price } = req.body
        let cart = await AddToCart.findOne();
        if (!cart) {
            cart = new AddToCart();
        }
        cart.item.push({ dishName, price });
        const saved = await cart.save();
        if (addToCart) {
            res.status(200).send({ count: saved.item.length })
        } else {
            res.status(400).send({ dishName, price })
        }
    } catch (error) {
        console.log(error)
    }
}

const Cart = async (req, res) => {
    try {
        const response = await AddToCart.find()
        let item = [];
        for (let i = 0; i < response.length; i++) {
            for (let j = 0; j < response[i].item.length; j++) {
                item.push(response[i].item[j])
            }

        }
        res.status(200).send({ message: item })
    } catch (error) {
        console.log(error)
        res.status(400).send({ error })
    }
}

const PlaceOrder = async (req, res) => {
    try {
        const Full_Name = req.body.Full_Name
        const Phone_Number = req.body.Phone_Number
        const Pin_Code = req.body.Pin_Code
        const State = req.body.State
        const City = req.body.City
        const House_No = req.body.House_No
        const Road_Name_Area_Colony = req.body.Road_Name_Area_Colony
        const No_People = req.body.No_People
        // res.status(200).send({ message: Phone_Number })
        const placeOrderResponce = await PlaceOrder_model.create(
            {
                Full_Name: Full_Name,
                Phone_Number: Phone_Number,
                Pin_Code: Pin_Code,
                State: State,
                City: City,
                House_No: House_No,
                Road_Name_Area_Colony: Road_Name_Area_Colony,
                No_People: No_People,

            })
        const deleteCart = await AddToCart.deleteMany({});
        res.status(200).send({ message: placeOrderResponce,deleteCart })
    } catch (error) {
        console.log(error)
        res.status(400).send({ error })
    }
}

module.exports = { login, signUp, SplashScreen, addDishToMenu, home, addToCart, Cart, PlaceOrder }