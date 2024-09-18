import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/context/ThemeContext';
import { jwtDecode } from 'jwt-decode';

type User = {
    id: string;
    username: string;
    email: string;
    profilePicture: string;
};

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        getUserFromToken();
    }, []);

    const getUserFromToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                router.replace('/login');
                return;
            }

            const decodedToken = jwtDecode<User>(token);
            setUser(decodedToken);
        } catch (error) {
            console.error('Error decoding token:', error);
            router.replace('/login');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                <Text style={[styles.text, { color: theme.textColor }]}>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!user) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
                <Text style={[styles.text, { color: theme.textColor }]}>No user data available</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.content}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.profilePicture}
                />
                <Text style={[styles.username, { color: theme.textColor }]}>{user.username}</Text>
                <Text style={[styles.email, { color: theme.textColor + '80' }]}>{user.email}</Text>
                <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.sendButtonColor }]}>
                    <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    profilePicture: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    email: {
        fontSize: 16,
        marginBottom: 10,
    },
    editButton: {
        padding: 10,
        borderRadius: 5,
    },
    editButtonText: {
        color: 'white',
        fontSize: 16,
    },
    text: {
        fontSize: 16,
    },
});