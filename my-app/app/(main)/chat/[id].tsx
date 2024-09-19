import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { fetchMessages, sendMessage } from '@/services/chatService';

export default function ChatScreen() {
    const { theme } = useTheme();
    const { token } = useAuth();
    const { id, recipientUsername, recipientProfilePicture } = useLocalSearchParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (token && id) {
            fetchMessages(token, id as string).then(setMessages).catch(console.error);
        }
    }, [token, id]);

    const handleSend = async () => {
        if (newMessage.trim() && token && id) {
            console.log('Sending message:', { token, chatId: id, text: newMessage.trim() });
            try {
                await sendMessage(token, id.toString(), newMessage.trim());
                setNewMessage('');
                fetchMessages(token, id.toString()).then(setMessages).catch(console.error);
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

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
                        <Text style={{ color: theme.textColor }}>{item.content}</Text>
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