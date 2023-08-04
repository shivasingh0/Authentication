const userModel = require("../model/userSchema");
const emailValidator = require("email-validator");
const bcrypt = require('bcrypt')

const signup = async (req, res, next) => {
  // information which is post to request

  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  // validators
  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  // email validator
  const emailValid = emailValidator.validate(email);
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Provide a valid email",
    });
  }
  // password validator
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password and Confirm password doesn't match",
    });
  }

  try {
    const userInfo = userModel(req.body); // if schema is defined same than this is used for saving data in DB
    const result = await userInfo.save(); // This is used for saving data in DATABASE

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    if (e.code === 11000) {
      // 11000 catch error for duplicte user
      return res.status(400).json({
        success: false,
        message: "This account is already exist",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};


// for sign-in
const signin = async (req, res) => {
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter email and password",
    });
  }
  try {
    const user = await userModel // it is use to search user in database
      .findOne({
        email,
      })
      .select("+password");

    // password validation
    if (!user || await !(bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password"
      });
    }

    // Token access
    const token = user.jwtToken();
    user.password = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookieOption);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

 // If Already logged-In
const getUser = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId)
    return res.status(200).json({
      success: true,
      data: user
    })
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message
    })
  }
}

// Log-Out user
const logOut = (req, res) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true
    }
    res.cookie('token', null, cookieOption)
    res.status(200).json({
      success: true,
      message: 'User Logged Out'
    })
  } catch (e) {
    res.status(400).json({
      success: false,
      message: e.message
    })
  }
}

module.exports = {
  signup,
  signin,
  getUser,
  logOut
};
