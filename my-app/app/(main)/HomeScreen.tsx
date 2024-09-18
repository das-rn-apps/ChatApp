import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Text, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ChatItem } from '@/types/chat';
import { fetchChats } from '@/services/chatService';
import { fetchUsers } from '@/services/userService';
import ChatListItem from '@/components/ChatListItem';
import Header from '@/components/Header';

export default function HomeScreen() {
    const [chatList, setChatList] = useState<ChatItem[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (token) {
            fetchChats(token).then(setChatList).catch(console.error);
            fetchUsers(token).then(setUsers).catch(console.error);
        }
    }, [isAuthenticated, token]);

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatSelect = (recipientEmail: string, chatId: string) => {
        router.push({
            pathname: '/chat/[id]',
            params: { id: chatId, recipientEmail }
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleChatSelect(item.email, item._id)}
        >
            <Text style={[styles.userEmail, { color: theme.textColor }]}>{item.email}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <Header />
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.searchInput, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                    placeholder="Search users..."
                    placeholderTextColor={theme.textColor}
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        setIsSearching(text.length > 0);
                    }}
                />
            </View>
            {isSearching ? (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                />
            ) : (
                <FlatList
                    data={chatList}
                    renderItem={({ item }) => <ChatListItem item={item} />}
                    keyExtractor={(item) => item._id}
                />
            )}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.sendButtonColor }]}
                onPress={() => router.push('/new-group')}
            >
                <Ionicons name="people" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchContainer: {
        padding: 10,
    },
    searchInput: {
        height: 40,
        borderRadius: 20,
        paddingHorizontal: 15,
    },
    userItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    userEmail: {
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});