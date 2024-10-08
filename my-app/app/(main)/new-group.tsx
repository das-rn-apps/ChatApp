import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { fetchUsers } from '@/services/userService';

export default function NewGroupScreen() {
    const { theme } = useTheme();
    const { token } = useAuth();
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedParticipants, setSelectedParticipants] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (token) {
            fetchUsers(token)
                .then(data => setUsers(data || []))
                .catch(error => {
                    console.log('Error fetching users1:', error);
                    setUsers([]);
                });
        }
    }, [token]);

    const createGroup = async () => {
        if (groupName.trim() === '' || selectedParticipants.length === 0) {
            Alert.alert('Error', 'Please enter group name and select participants');
            return;
        }

        const newGroup = {
            name: groupName,
            isGroup: true,
            participants: selectedParticipants,
        };

        try {
            const response = await axios.post(`${API_URL}/chats`, newGroup, {
                headers: { Authorization: `Bearer ${token}` }
            });
            Alert.alert('Success', 'Group created successfully', [
                { text: 'OK', onPress: () => router.push('/') }
            ]);
        } catch (error) {
            console.error('Error creating group:', axios.isAxiosError(error) ? error.response?.data : error);
            Alert.alert('Error', 'Failed to create group. Please try again.');
        }
    };

    const toggleParticipant = (userId) => {
        setSelectedParticipants(prevSelected =>
            prevSelected.includes(userId)
                ? prevSelected.filter(id => id !== userId)
                : [...prevSelected, userId]
        );
    };

    const renderUserItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.userItem,
                selectedParticipants.includes(item._id) && styles.selectedUserItem
            ]}
            onPress={() => toggleParticipant(item._id)}
        >
            <Text style={[styles.userName, { color: theme.textColor }]}>{item.username}</Text>
        </TouchableOpacity>
    );

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
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => item._id}
                    style={styles.userList}
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
    userList: {
        flex: 1,
        marginBottom: 20,
    },
    userItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    selectedUserItem: {
        backgroundColor: 'rgba(37, 211, 102, 0.1)',
    },
    userName: {
        fontSize: 16,
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