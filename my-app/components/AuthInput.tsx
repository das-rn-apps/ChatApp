import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const AuthInput: React.FC<TextInputProps> = (props) => {
    const { theme } = useTheme();

    return (
        <TextInput
            {...props}
            style={[
                styles.input,
                { backgroundColor: theme.inputBackgroundColor, color: theme.textColor },
                props.style
            ]}
            placeholderTextColor={theme.textColor + '80'}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default AuthInput;