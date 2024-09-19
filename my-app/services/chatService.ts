import axios from 'axios';
import { API_URL } from '@env';
import { ChatItem, Message } from '../types/chat';

export const fetchChats = async (token: string): Promise<ChatItem[]> => {
    try {
        const response = await axios.get(`${API_URL}/chats`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data && response.data.length > 0) {
            return response.data;
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
};

export const fetchChatData = async (id: string, token: string): Promise<ChatItem> => {
    const response = await axios.get(`${API_URL}/chats/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const fetchMessages = async (token: string, chatId: string) => {
    console.log(`Fetching messages for chat ${chatId}`);
    try {
        console.log(`Making GET request to ${API_URL}/chats/${chatId}/messages`);
        const response = await axios.get(`${API_URL}/chats/${chatId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log(`Received response:`, response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response?.data);
        }
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