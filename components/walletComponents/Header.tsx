import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    showCreateForm: boolean;
    onToggleForm: () => void;
}

export const Header = ({ showCreateForm, onToggleForm }: Props) => {
    const { theme } = useTheme();
    const router = useRouter();

    return (
        <Animated.View entering={FadeInUp.duration(600)} className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
        <TouchableOpacity
        onPress={() => router.back()}
        className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} mr-3`}
        >
        <MaterialIcons
        name="arrow-back"
        size={24}
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
        Portefeuilles
        </Text>
        </View>

        <TouchableOpacity
        onPress={onToggleForm}
        className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-400/20'}`}
        >
        <MaterialIcons
        name={showCreateForm ? 'close' : 'add'}
        size={24}
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        </TouchableOpacity>
        </Animated.View>
    );
};
