import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
    title: string;
    onPress: () => void;
};

const AuthButton: React.FC<Props> = ({ title, onPress }) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.sendButtonColor }]}
            onPress={onPress}
        >
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default AuthButton;