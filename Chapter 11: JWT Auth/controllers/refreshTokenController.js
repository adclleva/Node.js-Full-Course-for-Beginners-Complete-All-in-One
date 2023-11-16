const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    return res.sendStatus(401); // Unauthorized
  }

  console.log({ jwt: cookies.jwt });

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find((user) => user.refreshToken === refreshToken);

  if (!foundUser) {
    return res.sendStatus(403); // Forbidden
  }

  // evaluate the jwt
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username) {
      return res.sendStatus(403); // Forbidden
    }

    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" } // !! in production this should be longer for access tokens
    );

    res.json({ accessToken });
  });
};

module.exports = {
  handleRefreshToken,
};
