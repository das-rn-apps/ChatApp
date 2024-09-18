import mongoose from 'mongoose';

const groupInfoSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: '' },
    avatar: { type: String, default: '' },
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
}, {
    timestamps: true
});

export default mongoose.model('GroupInfo', groupInfoSchema);