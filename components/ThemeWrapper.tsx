import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    useEffect(() => {
        console.log('Thème actuel:', theme);
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