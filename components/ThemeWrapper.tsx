import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    useEffect(() => {
        console.log('Thème actuel:', theme);
    }, [theme]);

    return (
        <View className={theme === 'dark' ? 'dark' : 'light'}>
            {children}
        </View>
    );
}