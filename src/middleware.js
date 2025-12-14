const { dummyUsers } = require("./data");
const { JWT_SECRET } = require("./token.js");
const jwt = require("jsonwebtoken");

const checkAuth = (req, res, next) => {
  console.log("Middleware 1: Checking Authentication...");
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Authentication failed: Missing or malformed token.");
    return res
      .status(401)
      .json({ error: "Access Denied. Bearer token required." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userID = decoded.id;
    req.authenticatedUserId = userID;
    req.role = decoded.role;
    console.log(`Authentication successful for User ID: ${userID}`);
    next();
  } catch (err) {
    console.log("JWT Verification Failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token." });
  }

//   next();    
};

const checkPermission = (req, res, next) => {
  console.log("Middleware 3: Checking Permissions...");
  const role = req.role;
  if (role !== "user" && role !== "admin") {
    return res
      .status(403)
      .json({ error: "Forbidden. Insufficient permissions." });
  }
  console.log("Permissions granted.");
  next();
};

const loadUser = (req, res, next) => {
  console.log("Middleware 2: Loading Full User Data...");
  const userID = req.authenticatedUserId; // Get the ID from the previous middleware
  const user = dummyUsers[userID];

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    });
  }

  req.user = user;
  console.log(`User data loaded for ${user.name}`);
  next();
};

const userProtectionChain = [checkAuth,loadUser, checkPermission];

module.exports = {
  userProtectionChain,
};
