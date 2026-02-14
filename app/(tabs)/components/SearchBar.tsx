import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
}

export const SearchBar = ({ value, onChangeText }: Props) => {
    const { theme } = useTheme();

    return (
        <View className={`flex-row items-center ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'}
        rounded-xl px-4 py-2 mb-4`}>
        <MaterialIcons
        name="search"
        size={20}
        color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
        />
        <TextInput
        className={`flex-1 ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}
        placeholder="Rechercher un label..."
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={value}
        onChangeText={onChangeText}
        />
        {value !== '' && (
            <TouchableOpacity onPress={() => onChangeText('')}>
            <MaterialIcons
            name="close"
            size={20}
            color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            />
            </TouchableOpacity>
        )}
        </View>
    );
};
