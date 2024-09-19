import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email: string, password: string): Promise<{ token: string; user: any }> => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        const { token, user } = response.data;

        if (!token) {
            throw new Error("No token received from server");
        }

        if (!user) {
            throw new Error("No user info received from server");
        }

        await Promise.all([
            AsyncStorage.setItem('authToken', token),
            AsyncStorage.setItem('userInfo', JSON.stringify(user))
        ]);

        return { token, user };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
        } else {
            throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
        }
    }
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
    try {
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userInfo');
        console.log('Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
};