import Chat from '../models/Chat.js';
import User from '../models/User.js';
import GroupInfo from '../models/GroupInfo.js';
import PersonalChat from '../models/PersonalChat.js';

export const getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user._id })
            .populate('lastMessage')
            .populate('groupInfo')
            .sort({ updatedAt: -1 });

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: 'No chats found for this user' });
        }

        res.json(chats);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chats', error: error.toString() });
    }
};

export const createChat = async (req, res) => {
    try {
        const { name, isGroup, participants } = req.body;
        const chat = new Chat({ name, isGroup, participants });

        if (isGroup) {
            const groupInfo = new GroupInfo({
                name,
                admins: [req.user._id],
                members: participants,
                chat: chat._id
            });
            await groupInfo.save();
            chat.groupInfo = groupInfo._id;
        } else {
            const personalChat = new PersonalChat({
                chat: chat._id,
                user1: req.user._id,
                user2: participants[0]
            });
            await personalChat.save();
        }

        await chat.save();

        // Add chat to participants' chat lists
        await User.updateMany(
            { _id: { $in: participants } },
            { $push: { chats: chat._id } }
        );

        res.status(201).json(chat);
    } catch (error) {
        console.error('Error creating chat:', error);
        res.status(500).json({ message: 'Error creating chat', error: error.toString() });
    }
};

export const getChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.id)
            .populate('participants', 'username profilePicture')
            .populate('groupInfo')
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 50 }
            });

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.json(chat);
    } catch (error) {
        console.error('Error fetching chat:', error);
        res.status(500).json({ message: 'Error fetching chat', error: error.toString() });
    }
};

export const updateChat = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedChat = await Chat.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json(updatedChat);
    } catch (error) {
        console.error('Error updating chat:', error);
        res.status(500).json({ message: 'Error updating chat', error: error.toString() });
    }
};

export const deleteChat = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedChat = await Chat.findByIdAndDelete(id);
        if (!deletedChat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        // Remove chat from participants' chat lists
        await User.updateMany(
            { chats: id },
            { $pull: { chats: id } }
        );
        res.json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.error('Error deleting chat:', error);
        res.status(500).json({ message: 'Error deleting chat', error: error.toString() });
    }
};

// Remove this line as these functions are already exported individually
// export { getAllChats, createChat, getChatById, updateChat, deleteChat };