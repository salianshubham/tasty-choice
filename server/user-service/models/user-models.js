const mongoose = require('mongoose')
const jwt = require("jsonwebtoken")
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        requi: true,
        required: true
    },
    phone: {
        type: Number,
        requi: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const dishSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
    },
    dishName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    catagories: {
        type: String,
        required: true
    },
})
const Dish = new mongoose.model("Dish", dishSchema);
userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin
        },
            process.env.JWt_SECRETE_KEY, {
            expiresIn: "30d"
        }
        )
    } catch (error) {
        console.log(error)
    }
}


const User = new mongoose.model("User", userSchema);

module.exports = {User,Dish};