import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, register, logout } from '../services/authService';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (token) {
                setIsAuthenticated(true);
                setToken(token);
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
        } finally {
            setLoading(false);
        }
    };

    const authLogin = async (email: string, password: string) => {
        try {
            const { token, user } = await login(email, password);
            if (token && user) {
                setUser(user);
                setIsAuthenticated(true);
                setToken(token);
            } else {
                throw new Error("Invalid login response");
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const authRegister = async (email: string, password: string) => {
        try {
            const { token, user } = await register(email, password);
            await AsyncStorage.setItem('authToken', token);
            setUser(user);
            setIsAuthenticated(true);
            setToken(token);
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const authLogout = async () => {
        try {
            await logout();
            await AsyncStorage.removeItem('authToken');
            setUser(null);
            setIsAuthenticated(false);
            setToken(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login: authLogin,
                register: authRegister,
                logout: authLogout,
                loading,
                token
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};