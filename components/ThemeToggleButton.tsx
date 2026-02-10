import React from 'react';
import { TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggleButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <TouchableOpacity onPress={toggleTheme} className="p-2">
            <MaterialIcons
                name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
                size={24}
                color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
            />
        </TouchableOpacity>
    );
}