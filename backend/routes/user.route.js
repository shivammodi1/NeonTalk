const express = require('express');
const userRouter = express.Router();
const isAuth = require('../middleware/isAuth');
const { getCurrentUser, editProfile, getOtherUsers } = require('../controllers/user.controllers');
const upload = require('../middleware/multer');

userRouter.get('/current', isAuth, getCurrentUser);
userRouter.put('/profile', isAuth, upload.single('image'), editProfile);
userRouter.get('/others',isAuth, getOtherUsers);

module.exports = userRouter;
