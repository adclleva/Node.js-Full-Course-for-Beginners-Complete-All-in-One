const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (users) {
    this.users = users;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

// Bcrypt is a hashing function that is used to hash passwords and salt them
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required!" });
  }

  // check for duplicate usernames in the DB
  const duplicateUser = usersDB.users.find((user) => user.username === username);

  if (duplicateUser) {
    return res.sendStatus(409); // conflict
  }

  try {
    /**
     * Salt Rounds in Hashing:
     *
     * In bcrypt hashing, "salt rounds" refers to the number of iterations the hashing algorithm will go through.
     * The salt rounds parameter is exponential, meaning if you set it to 10, the algorithm runs 2^10 (or 1024) times.
     *
     * Purpose:
     * - Adds computational complexity, making brute-force attacks more difficult.
     * - Increases time to hash and verify passwords, so a balance between security and performance must be considered.
     *
     * Usage:
     * const saltRounds = 10;
     * const hashedPassword = bcrypt.hashSync(plainPassword, saltRounds);
     */
    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10); // we determine the salt rounds

    // store the new user
    const newUser = {
      username: username,
      password: hashedPassword,
    };

    usersDB.setUsers([...usersDB.users, newUser]);

    await fsPromises.writeFile(path.join(__dirname, "..", "model/users.json"), JSON.stringify(usersDB.users));

    console.log(usersDB.users);

    res.status(201).json({ success: `New User ${username} created!` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
