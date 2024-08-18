const jwt = require("jsonwebtoken");

function generateToken(user) {
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "30d" });
}

module.exports = { generateToken };
