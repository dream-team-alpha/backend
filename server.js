const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoute');
const messageRoutes = require('./routes/messageRoute');
const userRoutes = require('./routes/userRoutes');
const subAdminRoutes = require('./routes/subAdminRoute');
const feedbackRoutes = require('./routes/feedbackRoute');
const sequelize = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');
const Message = require('./models/messageModel');
const errorHandler = require('./middleware/errorHandler');
const path = require('path'); // for uploads
const { setSocketInstance } = require('./controllers/userController');

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
app.use('/api/feedback', feedbackRoutes);


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

setSocketInstance(io); 

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('sendMessage', (message) => {
    // Broadcast the message to all connected clients
    socket.broadcast.emit('receiveMessage', message);
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
