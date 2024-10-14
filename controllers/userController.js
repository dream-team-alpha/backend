const User = require("../models/userModel");

let io;

const setSocketInstance = (socketInstance) => {
  io = socketInstance;
};
// Create a new user
const createUser = async (req, res) => {
  const { name, email } = req.body;

  try {
    const newUser = await User.create({ name, email });

    if (io) {
      io.emit("userCreated", newUser);
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["createdAt", "DESC"]], // Sort by createdAt in descending order
    });

    if (io) {
      io.emit('userListUpdated', users);
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  setSocketInstance
};
