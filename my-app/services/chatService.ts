import axios from 'axios';
import { API_URL } from '@env';
import { ChatItem, Message } from '../types/chat';

export const fetchChats = async (token: string, id: string): Promise<ChatItem[]> => {
    try {
        const response = await axios.get(`${API_URL}/chats`, {
            params: { id },
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

export const fetchMessages = async (token: string, senderId: string, recipientUserId: string): Promise<Message[]> => {
    try {
        const response = await axios.post(
            `${API_URL}/chats/messages`,
            { senderId, recipientUserId },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error fetching messages:', error.response?.data || error.message);
        } else {
            console.error('Error fetching messages:', error);
        }
        throw error;
    }
};

export const sendMessage = async (token: string, senderId: string, recipientUserId: string, text: string) => {
    try {
        const response = await axios.post(
            `${API_URL}/chats/message`,
            { text, senderId, recipientUserId },
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