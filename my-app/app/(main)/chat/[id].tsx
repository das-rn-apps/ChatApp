import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchMessages, sendMessage } from '@/services/chatService';
import { Message } from '@/types/chat';
import { Theme } from '@/constants/theme';

export default function ChatScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { token, user } = useAuth();
    const { id, recipientUsername, recipientProfilePicture } = useLocalSearchParams();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

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
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.backgroundColor }}>
                <ActivityIndicator size="large" color={theme.textColor} />
            </View>
        );
    }

    const renderMessageItem = (item: Message, theme: Theme) => {
        const isUserMessage = item.sender._id === user.id;
        return (
            <View style={[
                styles.messageBubble,
                isUserMessage ? styles.userMessage : styles.otherMessage,
                { alignSelf: isUserMessage ? 'flex-end' : 'flex-start' }
            ]}>
                {!isUserMessage && (
                    <Text style={styles.senderName}>
                        {item.sender.username}
                    </Text>
                )}
                <Text style={[
                    styles.messageText,
                    { color: isUserMessage ? theme.userMessageTextColor : theme.otherMessageTextColor }
                ]}>
                    {item.text}
                </Text>
                <Text style={styles.messageTime}>
                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        )
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={[styles.header, { backgroundColor: theme.headerColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={[styles.headerTitle, { color: theme.textColor }]}>{recipientUsername}</Text>
                    <Image source={{ uri: recipientProfilePicture as string }} style={styles.profilePicture} />
                </View>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => renderMessageItem(item, theme)}
                ref={flatListRef}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                style={styles.messageContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity onPress={handleSend} style={[styles.sendButton, { backgroundColor: theme.sendButtonColor }]}>
                    <Ionicons name="send" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            height: 60,
            borderBottomWidth: 1,
            borderBottomColor: theme.borderColor,
        },
        backButton: {
            padding: 5,
        },
        headerContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: 10,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
        },
        profilePicture: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        messageContainer: {
            flex: 1,
            paddingHorizontal: 10,
        },
        messageBubble: {
            padding: 10,
            borderRadius: 20,
            marginVertical: 5,
            maxWidth: '80%',
        },
        userMessage: {
            alignSelf: 'flex-end',
            backgroundColor: theme.userMessageColor,
            borderBottomRightRadius: 5,
        },
        otherMessage: {
            alignSelf: 'flex-start',
            backgroundColor: theme.otherMessageColor,
            borderBottomLeftRadius: 5,
        },
        senderName: {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 4,
            marginTop: -7,
            color: theme.textSecondaryColor,
        },
        messageText: {
            fontSize: 16,
            lineHeight: 22,
        },
        messageTime: {
            fontSize: 10,
            color: theme.textSecondaryColor,
            alignSelf: 'flex-end',
            marginTop: 4,
            marginBottom: -7,
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
            maxHeight: 100,
        },
        sendButton: {
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });