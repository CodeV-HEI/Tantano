import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    initialName: string;
    onUpdate: (name: string) => Promise<void>;
    isUpdating: boolean;
    onCancel: () => void;
}

export const EditForm = ({ initialName, onUpdate, isUpdating, onCancel }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        await onUpdate(name.trim().toUpperCase());
    };

    return (
        <Animated.View entering={FadeInUp}
        className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-4`}>
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-3`}>
        MODIFIER LE LABEL
        </Text>

        <View className="flex-row items-center">
        <TextInput
        className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mr-2 border ${theme === 'dark' ? 'border-cyan-500' : 'border-cyan-400'}`}
        placeholder="Nouveau nom"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={name}
        onChangeText={setName}
        autoFocus
        editable={!isUpdating}
        />

        <TouchableOpacity
        onPress={handleSubmit}
        disabled={isUpdating || !name.trim()}
        className="p-3 rounded-xl bg-cyan-500/20"
        >
        {isUpdating ? (
            <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
        ) : (
            <MaterialIcons name="check" size={24} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
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
