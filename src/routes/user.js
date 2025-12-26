const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/Auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

router.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const userID = req.user._id;
    const requests = await ConnectionRequest.find({
      toUserID: userID,
      status: "interested",
    }).populate("fromUserID", "firstName lastName avatar age gender skills");
    return res.status(200).json({
      message: "Data fetched successfully",
      data: requests,
    });
  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});

router.get("/user/requests/sent", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const requests = await ConnectionRequest.find({
      fromUserID: loggedInUser._id, // Find requests sent BY me
    }).populate("toUserID", "firstName lastName avatar"); // RECEIVER

    res.json({
      message: "Sent requests fetched",
      data: requests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

router.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserID: loggedInUser._id, status: "accepted" },
        { fromUserID: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate(
        "fromUserID",
        "firstName lastName avatar age gender about skills"
      )
      .populate(
        "toUserID",
        "firstName lastName avatar age gender about skills"
      );

    const data = connectionRequests.map((row) => {
      if (row.fromUserID._id.toString() === loggedInUser._id.toString()) {
        return row.toUserID;
      }
      return row.fromUserID;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/user", async (req, res) => {
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

router.patch("/user", async (req, res, next) => {
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

router.delete("/user", async (req, res) => {
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

router.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserID: loggedInUser._id }, { toUserID: loggedInUser._id }],
    }).select("fromUserID toUserID");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUserFromFeed.add(req.fromUserID.toString());
      hideUserFromFeed.add(req.toUserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName avatar age gender about skills")
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      data: users,
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message || "something went wrong",
    });
  }
});

module.exports = router;
