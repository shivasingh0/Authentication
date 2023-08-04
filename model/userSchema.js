const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require('bcrypt')

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Enter a valid name"],
      trim: true,
      minLength: [5, "Name must be at least 5 character"],
      maxLength: [50, "Name must be less than 50 character"],
    },
    email: {
      type: String,
      require: [true, "Enter a valid email"],
      trim: true,
      unique: [true, "Already registered"],
      lowercase: true,
    },
    password: {
      type: String,
      select: false,
    },
    forgotPassword: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Bcrypt - Encript password before saving
userSchema.pre('save', async function (next){
  if(!this.isModified('password')){
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10)
  return next();
})

// TOKEN
userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this._email },
      process.env.SECRET,
      { expiresIn: "24h" }
    );
  },
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
