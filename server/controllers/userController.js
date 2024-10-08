import User from '../models/User.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'email username profilePicture');
        // console.log(users);
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
    } catch (error) {
        console.log('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// ... other controller functions ...