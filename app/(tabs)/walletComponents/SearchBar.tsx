// 📁 app/(tabs)/walletComponents/SearchBar.tsx (version premium)
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export const SearchBar = ({ value, onChangeText, placeholder = "Rechercher..." }: Props) => {
    const { theme } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    return (
        <Animated.View
        className={`flex-row items-center rounded-xl px-4 py-2 border-2 transition-all
            ${theme === 'dark'
                ? isFocused
                ? 'bg-gray-800 border-cyan-500'
                : 'bg-gray-900/50 border-gray-700'
                : isFocused
                ? 'bg-white border-cyan-400 shadow-lg shadow-cyan-400/20'
                : 'bg-cyan-50/50 border-gray-200'
            }`}
            >
            <MaterialIcons
            name={isFocused ? "search" : "search"}
            size={20}
            color={isFocused
                ? (theme === 'dark' ? '#06b6d4' : '#0891b2')
                : (theme === 'dark' ? '#9ca3af' : '#6b7280')
            }
            />

            <TextInput
            className={`flex-1 ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}
            placeholder={placeholder}
            placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            returnKeyType="search"
            clearButtonMode="while-editing"
            />

            {value !== '' && (
                <TouchableOpacity
                onPress={() => onChangeText('')}
                className="p-1 rounded-full bg-gray-500/20"
                >
                <MaterialIcons
                name="close"
                size={18}
                color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                />
                </TouchableOpacity>
            )}
            </Animated.View>
    );
};
