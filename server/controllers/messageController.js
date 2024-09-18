import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js'; // Add this import

export const getMessagesByChatId = async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.id })
            .sort({ createdAt: 'asc' })
            .populate('sender', 'username profilePicture');
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error: error.toString() });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { id: chatId } = req.params; // Change this line
        const { text } = req.body;
        const userId = req.user.userId;

        console.log('Received message request:', { chatId, text, userId });

        if (!text || !chatId) {
            console.log('Missing required fields');
            return res.status(400).json({ message: "Text and chatId are required" });
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
            console.log('Chat not found');
            return res.status(404).json({ message: "Chat not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: "User not found" });
        }

        const newMessage = new Message({
            sender: userId,
            senderName: user.username || user.email,
            text: text,
            chat: chatId
        });

        const savedMessage = await newMessage.save();

        chat.lastMessage = savedMessage._id;
        await chat.save();

        console.log('Message created successfully');
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error("Error creating message:", error);
        res.status(500).json({ message: "Error creating message", error: error.toString() });
    }
};