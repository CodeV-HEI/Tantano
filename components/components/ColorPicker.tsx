import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { COLOR_PALETTE } from '@/types/label';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
    selectedColor: string;
    onSelectColor: (color: string) => void;
}

export const ColorPicker = ({ selectedColor, onSelectColor }: Props) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const getColorName = (color: string) => {
        const colors: Record<string, string> = {
            '#FF6B6B': 'Rouge',
            '#4ECDC4': 'Turquoise',
            '#FFD93D': 'Jaune',
            '#6BCB77': 'Vert',
            '#9D65C9': 'Violet',
            '#FF8C42': 'Orange',
            '#4A90E2': 'Bleu',
            '#F38181': 'Rose',
            '#A8E6CF': 'Menthe',
            '#FFB347': 'Pêche',
            '#6C5B7B': 'Violet foncé',
            '#F9D56E': 'Moutarde',
        };
        return colors[color] || 'Couleur personnalisée';
    };

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row items-center justify-between p-3 rounded-lg border"
                style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
            >
                <View className="flex-row items-center">
                    <View className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: selectedColor }} />
                    <Text className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {getColorName(selectedColor)}
                    </Text>
                </View>
                <MaterialIcons 
                    name={isOpen ? 'expand-less' : 'expand-more'} 
                    size={20} 
                    color={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                />
            </TouchableOpacity>

            {isOpen && (
                <Animated.View 
                    entering={FadeInDown.springify()} 
                    className="mt-2 p-2 rounded-lg border"
                    style={{ 
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff'
                    }}
                >
                    <ScrollView style={{ maxHeight: 200 }} showsVerticalScrollIndicator={false}>
                        {COLOR_PALETTE.map((color) => (
                            <TouchableOpacity
                                key={color}
                                onPress={() => {
                                    onSelectColor(color);
                                    setIsOpen(false);
                                }}
                                className="flex-row items-center p-2 rounded-lg mb-1"
                                style={{ 
                                    backgroundColor: selectedColor === color 
                                        ? (theme === 'dark' ? '#06b6d420' : '#0891b220')
                                        : 'transparent'
                                }}
                            >
                                <View className="w-8 h-8 rounded-full mr-3" style={{ backgroundColor: color }} />
                                <Text className={`text-sm flex-1 ${
                                    selectedColor === color
                                        ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                                        : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {getColorName(color)}
                                </Text>
                                {selectedColor === color && (
                                    <MaterialIcons 
                                        name="check" 
                                        size={18} 
                                        color={theme === 'dark' ? '#06b6d4' : '#0891b2'} 
                                    />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};
