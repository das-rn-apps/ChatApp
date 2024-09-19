import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const router = useRouter();
    const { theme } = useTheme();
    const { user } = useAuth();

    return (
        <View style={[styles.container, { backgroundColor: theme.headerColor }]}>
            <TouchableOpacity onPress={() => router.push('/profile')}>
                <Image
                    source={user?.profilePicture ? { uri: user.profilePicture } : { uri: "https://picsum.photos/600" }}
                    style={styles.profilePic}
                />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.textColor }]}>DasChat</Text>
            <TouchableOpacity onPress={() => router.push('/settings')}>
                <Ionicons name="settings-outline" size={24} color={theme.textColor} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        height: 60,
    },
    profilePic: {
        width: 45,
        height: 45,
        borderRadius: 25,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default Header;