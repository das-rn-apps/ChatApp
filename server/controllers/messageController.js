import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getMessagesById = async (req, res) => {
    try {
        const { senderId, recipientUserId } = req.body;

        if (!senderId || !recipientUserId) {
            console.log('Missing required fields');
            return res.status(400).json({ message: "senderId and recipientUserId are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(recipientUserId)) {
            return res.status(400).json({ message: "Invalid senderId or recipientUserId" });
        }

        const senderObjectId = new mongoose.Types.ObjectId(senderId);
        const recipientObjectId = new mongoose.Types.ObjectId(recipientUserId);

        // Find the chat between these two users
        const chat = await Chat.findOne({
            participants: { $all: [senderObjectId, recipientObjectId] }
        });

        if (!chat) {
            return res.json([]);
        }

        const messages = await Message.find({ _id: { $in: chat.messages } })
            .sort({ createdAt: 1 })
            .populate('sender', 'username profilePicture')
            .populate('receiver', 'username profilePicture');

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error: error.toString() });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { senderId, recipientUserId, text } = req.body;
        if (!text || !senderId || !recipientUserId) {
            console.log('Missing required fields');
            return res.status(400).json({ message: "Text, senderId, and recipientUserId are required" });
        }

        let chat = await Chat.findOne({ participants: { $all: [senderId, recipientUserId] } });
        if (!chat) {
            console.log('Chat not found, creating a new one');
            chat = new Chat({
                participants: [senderId, recipientUserId],
                messages: [],
                lastMessage: null
            });
        }

        const user = await User.findById(senderId);
        const recipientUser = await User.findById(recipientUserId);

        if (!user || !recipientUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const newMessage = new Message({
            sender: senderId,
            senderName: user.username,
            receiver: recipientUserId,
            receiverName: recipientUser.username,
            text: text,
            senderProfilePicture: user.profilePicture,
            receiverProfilePicture: recipientUser.profilePicture
        });

        const savedMessage = await newMessage.save();

        chat.messages.push(savedMessage._id);
        chat.lastMessage = savedMessage._id;
        await chat.save();

        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Error creating message", error: error.toString() });
    }
};