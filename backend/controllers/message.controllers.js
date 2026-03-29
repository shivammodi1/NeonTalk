const Message = require('../models/message.model');
const Conversation = require('../models/conversation.model');
const { uploadOnCloudinary } = require('../config/cloudinary');
const { getReceiverSocketId, io } = require('../socket/socket');

const sendMessage = async (req, res) => {
    try {
        const sender = req.userId;
        const receiver = req.params.receiver;
        const { message } = req.body;

        let image;

        if (!message && !req.file) {
            return res.status(400).json({
                message: "Message or image required"
            });
        }


        // checking koi image aayi 
        if (req.file) {
            const uploaded = await uploadOnCloudinary(req.file.path);
            image = uploaded || "";
        }

        // hum yeh find kr rahe phale se coversarion h unn users ki
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        });

        // nhi h toh creates kr do new conversarion
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [sender, receiver]
            });
        }

        // agar h toh new message ko create krke ussi conversarion ke message me push kr do
        const newMessage = await Message.create({
            sender,
            receiver,
            message,
            image
        });

        conversation.messages.push(newMessage._id);
        await conversation.save();

        const receiverSocketId = getReceiverSocketId(receiver);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(200).json({
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};

const getMessages = async (req,res) => {
    try {
        const sender = req.userId;
        const receiver = req.params.receiver;
        // conversation find kr rahe user ki jisme dono participants ho
        let conversation = await Conversation.findOne({
            participants: { $all: [sender, receiver] }
        }).populate('messages');
        
        if(!conversation){
            return res.status(404).json({
                message: "No conversation found"
            });
        }
        res.status(200).json({
            message: "Messages fetched successfully",
            data: conversation?.messages
        });
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        });

    }
}

module.exports = { sendMessage, getMessages };