import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import { ChatItem } from '../types/chat';
import { useTheme } from '../context/ThemeContext';

type Props = {
    item: ChatItem;
};

const ChatListItem: React.FC<Props> = ({ item }) => {
    const { theme } = useTheme();

    return (
        <Link href={`/chat/${item._id}`} asChild>
            <TouchableOpacity style={[styles.container, { borderBottomColor: theme.textColor + '20' }]} >
                <Image
                    source={{ uri: item.isGroup ? 'https://via.placeholder.com/50' : item.participants[0].profilePicture }}
                    style={styles.avatar}
                />
                <View style={styles.content}>
                    <Text style={[styles.name, { color: theme.textColor }]}>{item.name}</Text>
                    {item.lastMessage && (
                        <Text style={[styles.lastMessage, { color: theme.textColor + '80' }]} numberOfLines={1}>
                            {item.lastMessage.text}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
        </Link>
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
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    lastMessage: {
        fontSize: 14,
    },
});

export default ChatListItem;