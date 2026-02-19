import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { COLOR_PALETTE } from '@/types/label';

interface Props {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onSelectColor }: Props) => {
    const { theme } = useTheme();

    return (
        <View className="mb-4">
        <Text className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Couleur du label
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {COLOR_PALETTE.map((color) => (
            <TouchableOpacity
            key={color}
            onPress={() => onSelectColor(color)}
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
        </View>
    );
};
