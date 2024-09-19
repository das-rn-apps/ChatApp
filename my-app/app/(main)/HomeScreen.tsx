import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Text, StatusBar, Image } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
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
    const { isAuthenticated, token, user } = useAuth();

    const loadData = useCallback(() => {
        if (!isAuthenticated) {
            router.replace('/login');
            return;
        }

        if (token) {
            fetchChats(token, user.id).then(setChatList).catch(() => setChatList([]));
            fetchUsers().then(data => setUsers(data || [])).catch(() => setUsers([]));
        }
    }, [isAuthenticated, token, user.id, router]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleChatSelect = (recipientUsername: string, recipientId: string, recipientProfilePicture: string) => {
        router.push({
            pathname: '/chat/[id]',
            params: { id: recipientId, recipientUsername, recipientProfilePicture }
        });
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.userItem}
            onPress={() => handleChatSelect(item.username, item._id, item.profilePicture)}
        >
            <Image source={{ uri: item.profilePicture }} style={{ width: 50, height: 50, borderRadius: 25 }} />
            <View style={{ flexDirection: 'column', marginLeft: 10 }}>
                <Text style={[styles.userEmail, { color: theme.textColor }]}>{item.username}</Text>
                <Text style={[styles.userEmail, { color: theme.textColor }]}>{item.email}</Text>
            </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        gap: 5,
        paddingHorizontal: 30,
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