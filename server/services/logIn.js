const bcrypt = require("bcrypt");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");

async function logInUser(username, password) {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  return user;
}

async function refreshToken(oldToken) {
  try {
    const decoded = jwt.verify(oldToken, secretKey);
    const user = await User.findById(decoded._id);
    const token = generateToken({
      id: user._id,
      username: user.username,
      email: user.email,
    });
    return token;
  } catch (e) {
    throw new Error("Invalid token");
  }
}

module.exports = { logInUser, refreshToken };
