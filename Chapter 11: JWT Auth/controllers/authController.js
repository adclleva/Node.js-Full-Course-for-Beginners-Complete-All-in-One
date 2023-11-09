const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const bycrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * we use fsPromises because we have not integrated the database yet or mongoDB
 * so instead of using a database, we use a JSON file
 */
const fsPromises = require("fs").promises;

const path = require("path");

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required!" });
  }

  const foundUser = usersDB.users.find((user) => user.username === username);

  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  // evaluate the password
  const match = await bycrypt.compare(password, foundUser.password);

  if (match) {
    // create the JWTs
    const accessToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        username: foundUser.username,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" } // refresh tokens should last longer than the access tokens
    );

    // we save refresh token to the database
    // this case, to the JSON file
    const otherUsers = usersDB.users.filter((user) => user.username !== foundUser.username);
    const currentUser = { ...foundUser, refreshToken };

    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(path.join(__dirname, "../model/users.json"), JSON.stringify(usersDB.users));

    // we save the refresh token in a cookie as a cookie as httpOnly so that it cannot be accessed by javascript
    res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 });

    // its important to save the accessToken in the client in memory as send it back to the client
    // so the frontend developer can get access to it
    return res.json({ success: `User ${username} is logged in!`, accessToken });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = {
  handleLogin,
};
