import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { COLOR_PALETTE } from '@/types/label';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    onCreate: (name: string, color: string) => Promise<void>;
    isCreating: boolean;
    onCancel: () => void;
}

export const CreateForm = ({ onCreate, isCreating, onCancel }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
    const handleSubmit = async () => {
        if (!name.trim()) return;

        console.log('CreateForm - envoi:', {
            name: name.trim().toUpperCase(),
                    color: selectedColor
        });

        await onCreate(name.trim().toUpperCase(), selectedColor);

        setName('');
        setSelectedColor(COLOR_PALETTE[0]);
    };

    return (
        <Animated.View entering={FadeInUp}
        className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-4`}
        >
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-3`}>
        NOUVEAU LABEL
        </Text>


        <TextInput
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mb-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        placeholder="Nom du label"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={name}
        onChangeText={setName}
        autoFocus
        editable={!isCreating}
        />

        <Text className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Choisis une couleur
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-4">
        {COLOR_PALETTE.map((color) => (
            <TouchableOpacity
            key={color}
            onPress={() => {
                console.log(' Couleur sélectionnée:', color);
                setSelectedColor(color);
            }}
            className="mr-3 items-center"
            >
            <View
            className={`w-10 h-10 rounded-full border-2 ${
                selectedColor === color
                ? 'border-cyan-500 scale-110'
                : 'border-transparent'
            }`}
            style={{ backgroundColor: color }}
            >
            {selectedColor === color && (
                <View className="absolute inset-0 items-center justify-center">
                <MaterialIcons name="check" size={20} color="white" />
                </View>
            )}
            </View>
            </TouchableOpacity>
        ))}
        </ScrollView>


        <View
        className="flex-row items-center p-3 rounded-xl mb-4"
        style={{ backgroundColor: selectedColor + '20' }}
        >
        <View className="w-8 h-8 rounded-lg mr-3" style={{ backgroundColor: selectedColor }} />
        <Text className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {name || "Aperçu du label"}
        </Text>
        </View>


        <View className="flex-row justify-end">
        <TouchableOpacity
        onPress={onCancel}
        className="px-4 py-2 mr-2 rounded-xl bg-red-500/20"
        >
        <Text className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
        Annuler
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={handleSubmit}
        disabled={isCreating || !name.trim()}
        className="px-4 py-2 rounded-xl bg-green-500/20"
        >
        {isCreating ? (
            <ActivityIndicator size="small" color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
        ) : (
            <Text className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
            Créer
            </Text>
        )}
        </TouchableOpacity>
        </View>
        </Animated.View>
    );
};
