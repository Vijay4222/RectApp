require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use('/api', routes);

// WebSocket event handling
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('bid', (data) => {
        // Handle new bid and notify all clients
        io.emit('update', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Database connection
sequelize.sync().then(() => {
    server.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
});
