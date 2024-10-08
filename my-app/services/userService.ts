import axios from 'axios';
import { API_URL } from '@env';

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return { message: 'No users found' };
        }
    }
};