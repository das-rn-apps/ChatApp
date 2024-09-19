import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { ChatItem } from '../types/chat';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

type Props = {
    item: ChatItem;
};

const ChatListItem: React.FC<Props> = ({ item }) => {
    const { theme } = useTheme();
    const { user } = useAuth();

    const handleChatSelect = (recipientUsername: string, recipientId: string, recipientProfilePicture: string) => {
        router.push({
            pathname: '/(main)/chat/[id]',
            params: { id: recipientId, recipientUsername, recipientProfilePicture }
        });
    };

    const isSender = item.lastMessage?.sender === user.id;
    const other = isSender ? item.lastMessage?.receiverName : item.lastMessage?.senderName;
    const otherId = isSender ? item.lastMessage?.receiver : item.lastMessage?.sender;
    const otherProfilePicture = isSender ? item.lastMessage?.receiverProfilePicture : item.lastMessage?.senderProfilePicture;

    return (
        <TouchableOpacity style={[styles.container, { borderBottomColor: theme.borderColor }]}
            onPress={() => {
                if (item.isGroup) {
                    router.push({
                        pathname: '/(main)/grpChat/[id]',
                        params: { id: item._id.toString(), name: item.name }
                    });
                } else {
                    handleChatSelect(other || '', otherId || '', otherProfilePicture || '');
                }
            }}
        >
            <Image
                source={{ uri: item.isGroup ? 'https://via.placeholder.com/50' : otherProfilePicture }}
                style={styles.avatar}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    {item.isGroup ? (
                        <Text style={[styles.name, { color: theme.textColor }]}>{item.name}</Text>
                    ) : (
                        <Text style={[styles.name, { color: theme.textColor }]}>{other}</Text>
                    )}
                    {item.lastMessage && (
                        <Text style={[styles.time, { color: theme.textColor + '80' }]}>
                            {new Date(item.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    )}
                </View>
                {item.lastMessage && (
                    <Text style={[styles.lastMessage, { color: theme.textColor + '80' }]} numberOfLines={1}>
                        {item.lastMessage.text}
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    time: {
        fontSize: 12,
    },
    lastMessage: {
        fontSize: 14,
    },
});

export default ChatListItem;