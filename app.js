const express = require("express")
const app = express();
const authRouter = require("./router/authRouter");
const connectDatabase = require("./config/db");
const cookieParser = require('cookie-parser')
const cors = require('cors')

connectDatabase();  // call database

app.use(express.json());  // used in controller to post details of client in json format
app.use(cookieParser());  // used for cookies
app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))

app.use('/api/auth/',authRouter)  // used to run localhost server it is the path

app.use('/',(req, res) => {
    res.status(200).json({ data : 'JWTauth server.' })
})

module.exports = app;