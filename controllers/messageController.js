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
  const userId = req.params.userId; // Get userId from route parameters
  const adminId = req.params.adminId; // Get adminId from route parameters
  const userType = req.userType; // Get userType from the token

  try {
    let messages;

    // For Admins: Fetch all messages
    if (userType === 'admin') {
      messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: adminId, receiverId: userId }, // Admin sending to user
            { senderId: userId, receiverId: adminId }  // User sending to admin
          ]
        }
      });
    } 
    // For Sub-Admins: Fetch relevant messages
    else if (userType === 'sub-admin') {
      messages = await Message.findAll({
        where: {
          [Op.or]: [
            { senderId: adminId, receiverId: userId }, // Sub-admin sending to user
            { senderId: userId, receiverId: adminId }, // User sending to sub-admin
            { receiverType: 'sub-admin', senderType: 'sub-admin' } // Messages between sub-admins
          ]
        },
        order: [['createdAt', 'DESC'], ['id', 'ASC']] // Optional: order by createdAt and id
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
