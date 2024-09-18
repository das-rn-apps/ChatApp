import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import AuthInput from '../components/AuthInput';
import AuthButton from '../components/AuthButton';

export default function AuthScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();
    const { theme, isDarkMode } = useTheme();
    const { login, register } = useAuth();

    const handleAuth = async () => {
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                if (password !== confirmPassword) {
                    Alert.alert('Error', 'Passwords do not match');
                    return;
                }
                await register(email, password);
            }
            router.replace('/(main)/HomeScreen');
        } catch (error) {
            console.error(`${isLogin ? 'Login' : 'Registration'} error:`, error);
            Alert.alert(`${isLogin ? 'Login' : 'Registration'} Failed`, 'Please check your input and try again.');
        }
    };

    const toggleAuthMode = () => setIsLogin(!isLogin);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
            <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.headerColor} />
            <View style={styles.content}>
                <Text style={[styles.title, { color: theme.textColor }]}>{isLogin ? 'Login' : 'Register'}</Text>
                <AuthInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <AuthInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    secureTextEntry
                />
                {!isLogin && (
                    <AuthInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        secureTextEntry
                    />
                )}
                <AuthButton title={isLogin ? 'Login' : 'Register'} onPress={handleAuth} />
                <TouchableOpacity onPress={toggleAuthMode}>
                    <Text style={[styles.toggleText, { color: theme.textColor }]}>
                        {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                    </Text>
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
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    toggleText: {
        marginTop: 20,
        textAlign: 'center',
    },
});