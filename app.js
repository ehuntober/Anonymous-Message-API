const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const authRoutes = require('./src/routes/authRoutes');
const messageRoutes = require('./src/routes/messageRoutes');
const userRoutes = require('./src/routes/userRoutes');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);


// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

module.exports = { app, server };