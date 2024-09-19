import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchMessages, sendMessage } from '@/services/chatService';
import { Message } from '@/types/chat';

export default function ChatScreen() {
    const { theme } = useTheme();
    const { token, user } = useAuth();
    const { id, recipientUsername, recipientProfilePicture } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const loadMessages = async () => {
        if (user && id && token) {
            try {
                const fetchedMessages = await fetchMessages(token, user.id, id.toString());
                setMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        loadMessages();
    }, [user, id, token]);

    const handleSend = async () => {
        if (newMessage.trim() && token && id && user) {
            try {
                await sendMessage(token, user.id, id.toString(), newMessage.trim());
                setNewMessage('');
                loadMessages()
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: theme.backgroundColor }]}>
                <ActivityIndicator size="large" color={theme.textColor} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: theme.headerColor }]}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.textColor }]}>{recipientUsername}</Text>
                <Image source={{ uri: recipientProfilePicture as string }} style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} />
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, { backgroundColor: theme.userMessageColor }]}>
                        <Text style={{ color: theme.textColor }}>{item.text}</Text>
                    </View>
                )}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.textColor}
                />
                <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.sendButtonColor }]}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        height: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        maxWidth: '80%',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
    },
    input: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    sendButton: {
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
});