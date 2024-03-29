const express = require("express")
const app = express();
require("dotenv").config();// import env file
const port = process.env.User_Service_Port || 5001 //assign port number from env
const router = require("./router/auth")
const connectDB = require("./dataBase/db")
const cors = require("cors")

const corsOperations = {
    origin: "https://tastychoice.netlify.app",
    methods: "GET, POST,PUT,DELETE,PATCH,HEAD",
    credentials: true
}
app.use(cors(corsOperations))
app.use(express.json())
app.use("/api/auth", router);

// app.get("/", (req, res) => {
//     res.status(200).send({
//         msg: "splash screen"
//     })
// })

connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server Running in Port Number : ", port)

    })
})

