const express = require("express");
const router = express.Router();
const { isEmpty, validateUser } = require("../config/validations.js");
const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const { userAuth } = require("../middlewares/Auth.js");

router.post("/signup", async (req, res, next) => {
  try {
    validateUser(req);
    const { firstName, lastName, email, password, age, gender } = req.body;
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptedPassword,
      age,
      gender,
    });
    await user.save();
    res.send(user);
  } catch (err) {
    return res.status(400).json({
      error: "Bad Request" + err.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      return res
        .status(400)
        .json({ error: "Please Enter Valid Login Credentials" });
    }

    const user = await User.findOne({ email: email });

    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: "Invalid Login Credentials" });
    }
    const token = await user.getJWTtoken();
    res.cookie("token", token);
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      message: "Login Successful",
      data: userResponse,
      token,
    });
  } catch (error) {
    console.error("Error in /login:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/logout",(req,res,next)=>{
  res.cookie("token",null,{
    "expires": new Date(Date.now())
  })
  return res.status(200).json({
    message : "Logout Successfull"
  })
})



// router.get("/feed", userAuth, async (req, res, next) => {
//   try {
//     const users = await User.find({});
//     if (users.length === 0) {
//       return res.status(404).json({
//         error: "User not found",
//       });
//     } else {
//       return res.status(200).json({
//         users,
//       });
//     }
//   } catch (error) {
//     return res.status(400).json({
//       error: "something went wrong",
//     });
//   }
// });

module.exports = router;
