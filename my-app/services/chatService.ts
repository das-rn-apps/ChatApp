import axios from 'axios';
import { API_URL } from '@env';
import { ChatItem, Message } from '../types/chat';

export const fetchChats = async (token: string): Promise<ChatItem[]> => {
    const response = await axios.get(`${API_URL}/chats`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    // console.log("Chats:", response.data);
    return response.data;
};

export const fetchChatData = async (id: string, token: string): Promise<ChatItem> => {
    const response = await axios.get(`${API_URL}/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const fetchMessages = async (token: string, chatId: string) => {
    try {
        const response = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
};

export const sendMessage = async (token: string, chatId: string, text: string) => {
    try {
        console.log('Sending message:', { chatId, text }); // Add this log
        const response = await axios.post(
            `${API_URL}/chats/${chatId}/messages`,
            { text },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error sending message:', error.response?.data || error.message);
        } else {
            console.error('Error sending message:', error);
        }
        throw error;
    }
};