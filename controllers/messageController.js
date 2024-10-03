const { Op } = require('sequelize');
const Message = require('../models/messageModel'); 

// Function to send a message (no token required)
exports.sendMessage = async (req, res) => {
  const { receiverId, content, receiverType, senderType } = req.body; 
  const senderId = req.body.senderId; // You can also take this from the request body if needed

  try {
    const message = await Message.create({ senderId, receiverId, content, senderType, receiverType });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error });
  }
};

// Function to fetch message history (token required)
exports.fetchMessageHistory = async (req, res) => {
  const userId = req.userId;
  const userType = req.userType;

  try {
    let messages;

    // For Admins: Fetch all messages
    if (userType === 'admin') {
      messages = await Message.findAll(); // Admin can see all messages
    } 
    // For Sub-Admins: Fetch all relevant messages
    else if (userType === 'sub-admin') {
      messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: userId }, // Messages sent by this sub-admin
            { receiverId: userId }, // Messages received by this sub-admin
            { receiverType: 'user' }, // Messages sent to users
            { senderType: 'user' }, // Messages received from users
            { receiverType: 'sub-admin' }, // Messages sent to other sub-admins
            { senderType: 'sub-admin' }  // Messages received from other sub-admins
          ]
        }
      });
    } else {
      return res.status(403).json({ message: 'Access denied' }); // Handle access for other users
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    res.status(500).json({ message: 'Failed to fetch messages', error });
  }
};
