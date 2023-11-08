const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const bycrypt = require("bcrypt");

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
    return res.json({ success: `User ${username} is logged in!` });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

module.exports = {
  handleLogin,
};
