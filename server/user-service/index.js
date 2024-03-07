const express = require("express")
const app = express();
require("dotenv").config();// import env file
const port = process.env.User_Service_Port || 5001 //assign port number from env
const router = require("./router/auth")
const connectDB = require("./dataBase/db")

app.use(express.json())
app.use("/api/auth", router);

connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server Running in Port Number : ", port)
    })
})

