const mongoose = require('mongoose');
const { Schema } = mongoose;

const conversationSchema = new Schema({

    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    
}, { timestamps: true });

const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = Conversation;

