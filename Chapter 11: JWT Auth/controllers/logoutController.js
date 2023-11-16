const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

// we use fsPromises here because we are mimicking a database
// since we are using a JSON file as our database, we need to read and write to it
const fsPromises = require("fs").promises;
const path = require("path");

const handleLogout = async (req, res) => {
  // on client, make sure to also delete the access token

  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(204); // No Content
  }

  const refreshToken = cookies.jwt;

  // is refreshToken in the database?
  const foundUser = usersDB.users.find((user) => user.refreshToken === refreshToken);

  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204); // No content
  }

  // Delete refreshToken from the database
  const otherUsers = usersDB.users.filter((user) => user.username !== foundUser.username);
  const currentUser = { ...foundUser, refreshToken: "" };

  usersDB.setUsers([...otherUsers, currentUser]);

  // this updates the JSON file
  await fsPromises.writeFile(path.join(__dirname, "../model/users.json"), JSON.stringify(usersDB.users));

  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 }); // secure: true in production -- only serves on https
  res.sendStatus(204); // No Content
};

module.exports = {
  handleLogout,
};
