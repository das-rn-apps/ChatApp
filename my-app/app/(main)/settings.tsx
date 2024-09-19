import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { theme, isDarkMode, toggleTheme } = useTheme();
    const { token, user, logout } = useAuth();


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <View style={styles.content}>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="person-outline" size={24} color={theme.textColor} style={styles.icon} />
                    <Text style={[styles.settingText, { color: theme.textColor }]}>Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="chatbubble-outline" size={24} color={theme.textColor} style={styles.icon} />
                    <Text style={[styles.settingText, { color: theme.textColor }]}>Chats</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="notifications-outline" size={24} color={theme.textColor} style={styles.icon} />
                    <Text style={[styles.settingText, { color: theme.textColor }]}>Notifications</Text>
                </TouchableOpacity>
                <View style={styles.settingItem}>
                    <Ionicons name="moon-outline" size={24} color={theme.textColor} style={styles.icon} />
                    <Text style={[styles.settingText, { color: theme.textColor }]}>Dark Mode</Text>
                    <Switch
                        value={isDarkMode}
                        onValueChange={toggleTheme}
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
                    />
                </View>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="help-circle-outline" size={24} color={theme.textColor} style={styles.icon} />
                    <Text style={[styles.settingText, { color: theme.textColor }]}>Help</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => {
                    logout()
                    router.replace('/login')
                }}>
                    <Ionicons name="log-out-outline" size={24} color={theme.textColor} style={styles.icon} />
                    <Text style={[styles.settingText, { color: theme.textColor }]}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    icon: {
        marginRight: 15,
    },
    settingText: {
        fontSize: 16,
    },
});