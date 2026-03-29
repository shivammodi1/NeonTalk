const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const authRouter = require('./routes/auth.routes');
dotenv.config();
const cors = require('cors');
const userRouter = require('./routes/user.route');
const messageRouter = require('./routes/message.routes');
const { app, server } = require('./socket/socket');


app.use(express.json());
app.use(cookieParser());



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/msg',messageRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running at http://localhost:${PORT}`);
});
