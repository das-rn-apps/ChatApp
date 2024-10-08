import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchMessages, sendMessage } from '@/services/chatService';
import { Message } from '@/types/chat';
import { Theme } from '@/constants/theme';
import io from 'socket.io-client';
import { SOCKET_URL } from '@env';

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
    const socketRef = useRef<any>(null);

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
        socketRef.current = io(SOCKET_URL);
        socketRef.current.on('updateMessages', (updatedMessage: Message) => {
            setMessages(prevMessages => [...prevMessages, updatedMessage]);
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [user, id, token]);

    const handleSend = async () => {
        if (newMessage.trim() && token && id && user) {
            try {
                const sentMessage = await sendMessage(token, user.id, id.toString(), newMessage.trim());
                setNewMessage('');

                // Append the new message locally
                setMessages(prevMessages => [...prevMessages, sentMessage]);

                // Emit the message through socket to update all members
                socketRef.current.emit('newMessage', { chatId: id, message: sentMessage });
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.textColor} />
            </View>
        );
    }

    const renderMessageItem = ({ item }: { item: Message }) => {
        const isUserMessage = item.sender._id === user.id;

        return (
            <View style={[
                styles.messageBubble,
                isUserMessage ? styles.userMessage : styles.otherMessage,
            ]}>
                {!isUserMessage && (
                    <View style={styles.senderInfo}>
                        <Image source={{ uri: item.sender.profilePicture }} style={styles.chatProfilePicture} />
                        <Text style={styles.senderName}>
                            {item.sender.username}
                        </Text>
                    </View>
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
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.textColor} />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <Text style={styles.headerTitle}>{recipientUsername}</Text>
                    <Image source={{ uri: recipientProfilePicture as string }} style={styles.profilePicture} />
                </View>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={renderMessageItem}
                ref={flatListRef}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                style={styles.messageContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.textSecondaryColor}
                    multiline
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
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
            backgroundColor: theme.backgroundColor,
        },
        loadingContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.backgroundColor,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 15,
            height: 60,
            backgroundColor: theme.headerColor,
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
            marginLeft: 15,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.textColor,
        },
        profilePicture: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        chatProfilePicture: {
            width: 24,
            height: 24,
            borderRadius: 12,
            marginRight: 8,
        },
        messageContainer: {
            flex: 1,
            paddingHorizontal: 15,
        },
        messageBubble: {
            padding: 12,
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
        senderInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 5,
        },
        senderName: {
            fontSize: 12,
            fontWeight: 'bold',
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
        },
        inputContainer: {
            flexDirection: 'row',
            padding: 10,
            backgroundColor: theme.inputBackgroundColor,
        },
        input: {
            flex: 1,
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginRight: 10,
            maxHeight: 100,
            backgroundColor: theme.backgroundColor,
            color: theme.textColor,
        },
        sendButton: {
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.sendButtonColor,
        },
    });