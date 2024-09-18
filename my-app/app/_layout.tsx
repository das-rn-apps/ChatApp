import * as React from 'react';
import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';

export default function Root() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <Slot />
            </ThemeProvider>
        </AuthProvider>
    );
}
