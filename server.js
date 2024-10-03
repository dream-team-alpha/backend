const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoute');
const messageRoutes = require('./routes/messageRoute');
const userRoutes = require('./routes/userRoutes');
const subAdminRoutes = require('./routes/subAdminRoute');
const sequelize = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');
const errorHandler = require('./middleware/errorHandler');
const path = require('path'); // for uploads

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


// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/subadmin', subAdminRoutes);

// Database Sync Function
const syncDatabase = async () => {
  try {
    // Consider using migrations for production
    await sequelize.sync();
    console.log('Database synced');
  } catch (err) {
    console.error('Error syncing database:', err);
  }
};

syncDatabase();

// Socket.IO Connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Listen for send message event
  socket.on('sendMessage', async (message) => {
    const { senderId, receiverId, content, senderType, receiverType } = message;

    // Save the message to the database
    try {
      const savedMessage = await Message.create({
        senderId,
        receiverId,
        content,
        senderType,
        receiverType,
      });
      // Broadcast message to the receiver
      io.to(receiverId).emit('receiveMessage', savedMessage);
      socket.emit('messageSent', savedMessage); // Acknowledge sender
    } catch (error) {
      console.error('Failed to send message:', error);
      socket.emit('error', 'Failed to send message');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
