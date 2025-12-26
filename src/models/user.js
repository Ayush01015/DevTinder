const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLenght: 50,
    },
    lastname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (p) => {
          return p.trim().length > 5;
        },
        message: (props) => `Password should be of atleast 6 characters`,
      },
    },
    age: {
      type: Number,
      min: 18,
      max: 100,
    },
    gender: {
      type: String,
      enum: ["male", "female", "others"],
    },
    avatar: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: (v) => {
          return /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    skills: {
      type: [String],
      validate: {
        validator: function (skills) {
          return skills.length <= 10;
        },
        message: "Aukaat mein raho bhai !!! (Max 10 skills allowed)",
      },
    },
  },
  {
    timestamps: true,
  }
);

/*
  "this" is an instance of userSchema which represent current user.
  so writing this._id is same as writing user._id where user is currect user for ex. Ayush, Vishal, ...
*/

userSchema.methods.getJWTtoken = async function () {
  return await jwt.sign({ _id: this._id }, "wifuh#%#@$!@#()989", {
    expiresIn: "7d",
  });
};

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
