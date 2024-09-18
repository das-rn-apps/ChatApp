import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

const Layout = () => {
    const { theme, isDarkMode } = useTheme();

    return (<>
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} backgroundColor={theme.headerColor} />
        <View style={{ flex: 1, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight : 25 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' },
                }}
            />
        </View>
    </>
    );
};


export default Layout;
