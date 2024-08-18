const User = require("../models/user");
const bcrypt = require("bcrypt");

async function createUser(userData) {
  const { username, password, email, salt } = userData;
  const hashedPassword = await bcrypt.hash(password, salt);
  const createdUser = new User({ username, email, password: hashedPassword });
  const savedUser = await createdUser.save();
  return savedUser;
}

module.exports = { createUser };
