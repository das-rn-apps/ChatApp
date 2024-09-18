import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

interface ThemeContextType {
    theme: Theme;
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    isDarkMode: false,
    toggleTheme: () => { },
});

// Create the provider component
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    useEffect(() => {
        // Load the theme preference from AsyncStorage
        const loadThemePreference = async () => {
            const storedTheme = await AsyncStorage.getItem('themePreference');
            if (storedTheme !== null) {
                setIsDarkMode(storedTheme === 'dark');
            }
        };
        loadThemePreference();
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
        AsyncStorage.setItem('themePreference', isDarkMode ? 'light' : 'dark');
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Create a custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);