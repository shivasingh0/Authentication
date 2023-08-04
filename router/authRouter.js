const express = require("express")
const { signup, signin, getUser, logOut} = require('../controller/authController')  // require signup from controller
const jwtAuth = require("../middleware/jwtAuth")

const authRouter = express.Router()  // mendatory to require router

authRouter.post('/signup', signup)  // router post request
authRouter.post('/signin', signin)  // router post request
authRouter.get('/user', jwtAuth, getUser)    // Get user information when he is logged-in
authRouter.get('/logOut', jwtAuth, logOut)  // Log-out the user

module.exports = authRouter;