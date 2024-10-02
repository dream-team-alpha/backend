const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoute');
const messageRoutes = require('./routes/messageRoute');
const userRoutes = require('./routes/userRoutes');
const subAdminRoutes = require('./routes/subAdminRoute'); // Include sub-admin routes
const sequelize = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');
const errorHandler = require('./middleware/errorHandler'); // Custom error handling middleware

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
  },
});

// Middleware setup
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subadmin', subAdminRoutes); // Add sub-admin routes

// Database Sync Function
const syncDatabase = async () => {
  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
};

syncDatabase();

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinRoom', (userId) => {
    console.log(`User ${socket.id} joining room for userId ${userId}`);
    socket.join(userId);  // Join a room with userId
  });

  socket.on('sendMessage', async (messageData) => {
    console.log('Message received from user:', messageData);
    const { senderId, receiverId, content } = messageData;

    // Validate message data
    if (!senderId || !receiverId || !content) {
      console.error('Invalid message data:', messageData);
      return; // Exit if the message data is not valid
    }

    try {
      // Save message to DB
      const newMessage = await Message.create({ senderId, receiverId, content });
      // Emit the message to both sender and receiver
      io.to(senderId).emit('newMessage', newMessage); // Send to user
      io.to(receiverId).emit('newMessage', newMessage); // Send to admin (admin should be listening to this)
      console.log(`Message sent to ${senderId} and ${receiverId}`);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Error Handling Middleware
app.use(errorHandler); // Use custom error handling middleware

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
