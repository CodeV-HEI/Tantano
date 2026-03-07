import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    onSubmit: (amount: number, day: number) => Promise<void>;
    onCancel: () => void;
    isUpdating?: boolean;
}

export const IncomeForm = ({ onSubmit, onCancel, isUpdating }: Props) => {
    const { theme } = useTheme();
    const [amount, setAmount] = useState('');
    const [day, setDay] = useState('1');

    const handleSubmit = async () => {
        const amountNum = parseFloat(amount);
        const dayNum = parseInt(day) || 1;

        if (isNaN(amountNum) || amountNum <= 0) {
            return;
        }
        if (dayNum < 1 || dayNum > 31) {
            return;
        }

        await onSubmit(amountNum, dayNum);
    };

    return (
        <View className={`${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-xl p-4 border ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}>
        <Text className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mb-3`}>
        Configurer le revenu automatique (Premium)
        </Text>

        <TextInput
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        placeholder="Montant mensuel (Ar)"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        editable={!isUpdating}
        />

        <TextInput
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        placeholder="Jour du mois (1-31)"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={day}
        onChangeText={setDay}
        keyboardType="numeric"
        editable={!isUpdating}
        />

        <View className="flex-row justify-end">
        <TouchableOpacity
        onPress={onCancel}
        className="px-4 py-2 mr-2 rounded-xl bg-red-500/20"
        disabled={isUpdating}
        >
        <Text className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
        Annuler
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={handleSubmit}
        className="px-4 py-2 rounded-xl bg-green-500/20"
        disabled={isUpdating}
        >
        <Text className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
        Configurer
        </Text>
        </TouchableOpacity>
        </View>
        </View>
    );
};
