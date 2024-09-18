import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '../types/chat';
import { useTheme } from '../context/ThemeContext';

type Props = {
    message: Message;
    isCurrentUser: boolean;
};

const MessageBubble: React.FC<Props> = ({ message, isCurrentUser }) => {
    const { theme } = useTheme();

    return (
        <View style={[
            styles.container,
            isCurrentUser ? styles.currentUser : styles.otherUser,
            { backgroundColor: isCurrentUser ? theme.userMessageColor : theme.otherMessageColor }
        ]}>
            {!isCurrentUser && (
                <Text style={[styles.username, { color: theme.textColor }]}>{message.sender.username}</Text>
            )}
            <Text style={[styles.messageText, { color: theme.textColor }]}>{message.text}</Text>
            <Text style={[styles.time, { color: theme.textColor + '80' }]}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        maxWidth: '80%',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    currentUser: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    otherUser: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
    },
    username: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    messageText: {
        fontSize: 16,
    },
    time: {
        fontSize: 12,
        alignSelf: 'flex-end',
        marginTop: 5,
    },
});

export default MessageBubble;