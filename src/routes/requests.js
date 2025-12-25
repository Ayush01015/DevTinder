const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/Auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

router.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res, next) => {
    try {
      const status = req.params.status;
      const fromUserID = req.user._id;
      const toUserID = req.params.toUserId;

      const userID = await User.findById(toUserID);

      if (!userID) {
        return res.status(404).json({
          error: "User not found !!!",
        });
      }

      if (fromUserID.toString() === toUserID) {
        return res.status(400).json({
          error: "You cannot send a connection request to yourself!",
        });
      }

      const allowedConnectionRequst = ["interested", "ignored"];

      if (!allowedConnectionRequst.includes(status)) {
        return res.status(400).json({
          error: "Invalid status type: " + status,
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserID, toUserID },
          { fromUserID: toUserID, toUserID: fromUserID },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).json({
          error: "Connection Request already exists!!",
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserID,
        toUserID,
        status,
      });

      const data = await connectionRequest.save();

      return res.json({
        message: req.user.firstName + " is " + status + " in " + toUserID,
        data,
      });
    } catch (error) {
      return res.status(400).json({
        error: error.message,
      });
    }
  }
);

router.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res, next) => {
    try {
      const { status, requestID } = req.params;
      const loggedInUser = req.user;

      if (!status || !requestID) {
        return res.status(400).json({
          error: "Invalid connection request",
        });
      }

      const allowedStatus = ["rejected", "accepted"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          error: "Invalid Status",
        });
      }
      const connectionRequest = await ConnectionRequest.findOneAndUpdate(
        {
          fromUserID: requestID,
          toUserID: loggedInUser._id, //Make sure it was sent TO me
          status: "interested",
        },
        { status: status },
        { runValidators: true, returnDocument: "after" }
      );

      if (!connectionRequest) {
        return res.status(404).json({ error: "Connection request not found" });
      }

      return res.json({
        message: "Connection request " + status,
        data: connectionRequest,
      });
    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

module.exports = router;
