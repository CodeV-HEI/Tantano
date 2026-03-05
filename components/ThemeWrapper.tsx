import React, { useEffect } from 'react';
import { View, StatusBar } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    return (
        <View
            className={`flex-1 ${theme === 'dark' ? 'dark' : ''}`}
            style={{ backgroundColor: theme === 'dark' ? '#000000' : '#ffffff' }}
        >
            {children}
        </View>
    );
}