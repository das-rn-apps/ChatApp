import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export default function NewGroupScreen() {
    const { theme, isDarkMode } = useTheme();
    const [groupName, setGroupName] = useState('');
    const [participants, setParticipants] = useState('');
    const router = useRouter();

    const createGroup = async () => {
        if (groupName.trim() === '' || participants.trim() === '') {
            Alert.alert('Error', 'Please enter group name and participants');
            return;
        }

        const participantList = participants.split(',').map(p => p.trim());
        const newGroup = {
            name: groupName,
            isGroup: true,
            participants: participantList,
        };

        try {
            const response = await axios.post(`${API_URL}/chats`, newGroup);
            console.log('Group created:', response.data);
            Alert.alert('Success', 'Group created successfully', [
                { text: 'OK', onPress: () => router.push('/') }
            ]);
        } catch (error) {
            console.error('Error creating group:', axios.isAxiosError(error) ? error.response?.data : error);
            Alert.alert('Error', 'Failed to create group. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.content}>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                    placeholder="Group Name"
                    placeholderTextColor={theme.textColor + '80'}
                    value={groupName}
                    onChangeText={setGroupName}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: theme.inputBackgroundColor, color: theme.textColor }]}
                    placeholder="Participants (comma-separated)"
                    placeholderTextColor={theme.textColor + '80'}
                    value={participants}
                    onChangeText={setParticipants}
                />
                <TouchableOpacity style={[styles.button, { backgroundColor: theme.sendButtonColor }]} onPress={createGroup}>
                    <Text style={styles.buttonText}>Create Group</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    button: {
        backgroundColor: '#25D366',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});