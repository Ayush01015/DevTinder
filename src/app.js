const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js")
const profileRouter = require('./routes/profile.js')
const requestRouter = require('./routes/requests.js')
const userRouter = require('./routes/user.js')

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
