const jwt = require("jsonwebtoken");
const JWT_SECRET = "YOUR_SUPER_SECRET_KEY_FOR_TESTING";

function createTestToken(userId,role) {
  const payload = {
    id: userId,
    role: role,
  };

  // Sign the token: creates the final, verifiable string
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

module.exports = {
  createTestToken,
  JWT_SECRET
};
