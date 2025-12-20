const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const User = require("./models/user.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const { isEmpty, validateUser } = require("./config/validations.js");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res, next) => {
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

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isEmpty(email) || isEmpty(password)) {
      return res
        .status(400)
        .json({ error: "Please Enter Valid Login Credentials" });
    }

    const user = await User.findOne({ email: email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid Login Credentials" });
    }
    const token = await jwt.sign({ _id: user._id }, "wifuh#%#@$!@#()989");
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

app.get("/profile", async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if(!token){
      return res.status(401).json({
        error:"Invalid token"
      })
    }
    const { _id } = await jwt.verify(token, "wifuh#%#@$!@#()989");
    const { firstName, lastName, email, age, gender, skills, avatar } =
      await User.findById(_id);
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

app.get("/feed", async (req, res, next) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({
        error: "User not found",
      });
    } else {
      return res.status(200).json({
        users,
      });
    }
  } catch (error) {
    return res.status(400).json({
      error: "something went wrong",
    });
  }
});

// app.post("/user", async (req, res, next) => {
//   try {
//     if (!isEmpty(req.body.email)) {
//       const email = req.body.email;
//       try {
//         const users = await User.findOne({ email: email });
//         if(!isEmpty()){
//             res.status(200).send(users);
//         }else{
//             return res.status(404).json({
//           error: "User Not found",
//         });
//         }
//       } catch (error) {
//         return res.status(400).json({
//           error: "something went wrong",
//         });
//       }
//     } else {
//       return res.status(400).json({
//         error: "Please Enter Valid Email ID",
//       });
//     }
//   } catch (error) {}
// });

app.post("/user", async (req, res) => {
  try {
    const { email } = req.body;
    if (isEmpty(email)) {
      return res.status(400).json({ error: "Please Enter Valid Email ID" });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ error: "User Not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in /user route:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.patch("/user", async (req, res, next) => {
  try {
    const data = req.body;
    // const id  = req.params.id; //params
    const id = req.query.id; //query params
    // console.log("id",id)
    const ALLOWED_UPDATES = ["avatar", "gender", "age", "lastname", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      return res.status(400).json({
        error: "something went wrong, please enter valid fields to update",
      });
    }
    const user = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after", // Returns the NEW updated user, not the old one
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.log("Error details:", error.message);
    return res.status(400).json({ error: "Update failed: " + error.message });
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.id;
    if (!userId) {
      return res.status(400).json({ error: "Please provide a User ID" });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "User deleted successfully", deletedUser: user });
  } catch (error) {
    console.log("Error in DELETE /user:", error.message);
    return res
      .status(500)
      .json({ error: "Something went wrong: " + error.message });
  }
});

connectDB()
  .then(() => {
    console.log("Database connected !!!");
    app.listen(3000, () => {
      console.log(`Server is successfully listening on port 3000`);
    });
  })
  .catch((err) => {
    console.log("Database not connected !!!", err);
  });
