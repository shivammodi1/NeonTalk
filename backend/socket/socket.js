const http = require('http');
const socketIo = require('socket.io');
const Server = require('socket.io').Server;
const express = require('express');
const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors:{
        origin: 'https://neontalk-f640.onrender.com'
    }
});

// on -> is used to listen for events from the client
// emit -> is used to send events to the client
// io -> it is the main socket.io server that can send or receive events from all connected clients
// socket -> it respresent the single individual client that is connected to the server, it can send or receive events from that particular client only.

const userSocketMap = {};
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on('connection',(socket)=>{
    // console.log(`User connected: ${socket.id}`);
    // // Send a welcome message to the newly connected client
    // io.emit('welcome', `Welcome to the chat, user ${socket.id}!`);

    const userId = socket.handshake.query.userId;
    if(userId!=undefined){
        // console.log(`User connected: ${userId} : ${socket.id}`);
        userSocketMap[userId] = socket.id;
    }

    // getOnlineUsers
    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
        // console.log(`User disconnected: ${socket.id}`);
    });
});

module.exports = {app, server, io, userSocketMap,getReceiverSocketId};
