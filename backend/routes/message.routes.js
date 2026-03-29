
const express = require('express');
const { sendMessage,getMessages } = require('../controllers/message.controllers');
const messageRouter = express.Router();
const isAuth = require('../middleware/isAuth');
const upload = require('../middleware/multer');

messageRouter.post('/send/:receiver',isAuth,upload.single('image'),sendMessage);
messageRouter.get('/get/:receiver',isAuth,getMessages);


module.exports = messageRouter;