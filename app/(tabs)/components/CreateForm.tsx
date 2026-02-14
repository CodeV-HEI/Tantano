import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    onCreate: (name: string) => Promise<void>;
    isCreating: boolean;
    onCancel: () => void;
}

export const CreateForm = ({ onCreate, isCreating, onCancel }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');

    const handleSubmit = async () => {
        if (!name.trim()) return;
        await onCreate(name.trim().toUpperCase());
        setName('');
    };

    return (
        <Animated.View entering={FadeInUp}
        className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-4`}>
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-3`}>
        NOUVEAU LABEL
        </Text>

        <View className="flex-row items-center">
        <TextInput
        className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mr-2 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        placeholder="Nom du label"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={name}
        onChangeText={setName}
        autoFocus
        editable={!isCreating}
        />

        <TouchableOpacity
        onPress={handleSubmit}
        disabled={isCreating || !name.trim()}
        className="p-3 rounded-xl bg-green-500/20"
        >
        {isCreating ? (
            <ActivityIndicator size="small" color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
        ) : (
            <MaterialIcons name="check" size={24} color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
        )}
        </TouchableOpacity>

        <TouchableOpacity
        onPress={onCancel}
        className="p-3 ml-2 rounded-xl bg-red-500/20"
        >
        <MaterialIcons name="close" size={24} color={theme === 'dark' ? '#f87171' : '#dc2626'} />
        </TouchableOpacity>
        </View>
        </Animated.View>
    );
};
