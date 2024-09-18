import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email: string, password: string) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token, user } = response.data;
    if (token) {
        await AsyncStorage.setItem('authToken', token);
    } else {
        console.error("No token received from server");
    }
    if (user) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(user));
    } else {
        console.error("No user info received from server");
    }
    return { token, user };
};

export const register = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, { email, password });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Registration error:', error.response?.data || error.message);
        } else {
            console.error('Registration error:', error instanceof Error ? error.message : String(error));
        }
        throw error;
    }
};

export const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userInfo');
};