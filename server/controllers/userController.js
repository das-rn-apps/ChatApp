import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'email profilePicture');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.toString() });
    }
};