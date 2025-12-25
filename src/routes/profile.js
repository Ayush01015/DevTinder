const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/Auth.js");
const User = require("../models/user.js");

router.get("/profile/view", userAuth, async (req, res, next) => {
  try {
    const { firstName, lastName, email, age, gender, skills, avatar } =
      req.user;
    res.status(200).json({
      firstName,
      lastName,
      email,
      age,
      gender,
      skills,
      avatar,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch("/profile/edit", userAuth, async (req, res, next) => {
  try {
    const userID = req.user._id;

    const allowedEditFields = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "avatar",
    ];

    const isEditAllowed = Object.keys(req.body).every((field) => {
      allowedEditFields.includes(field);
    });

    if (!isEditAllowed) {
      return res
        .status(400)
        .json({
          error: "Update not allowed: You explicitly included a forbidden field (like email or password).",
        });
    }

    const user = await User.findByIdAndUpdate(userID, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
