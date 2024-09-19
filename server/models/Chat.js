import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    name: { type: String, required: true },
    isGroup: { type: Boolean, default: false },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
    lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, {
    timestamps: true
});

export default mongoose.model('Chat', chatSchema);