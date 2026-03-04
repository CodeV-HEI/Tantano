import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { COLOR_PALETTE } from '@/types/label';
import Animated, { FadeInUp, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { IconPicker, AVAILABLE_ICONS } from './IconPicker';

interface Props {
    visible: boolean;
    onCreate: (name: string, color: string, iconRef?: string) => Promise<void>;
    isCreating: boolean;
    onCancel: () => void;
}

const ColorPicker = ({ selectedColor, onSelectColor }: { selectedColor: string; onSelectColor: (color: string) => void }) => {
    const { theme } = useTheme();

    return (
        <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Choisir une couleur
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row py-2"
            >
                {COLOR_PALETTE.map((color, index) => (
                    <Animated.View
                        key={color}
                        entering={FadeInDown.delay(index * 50).springify()}
                    >
                        <TouchableOpacity
                            onPress={() => onSelectColor(color)}
                            className="mr-3 items-center"
                        >
                            <View
                                className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color
                                        ? 'border-cyan-500 scale-110 shadow-lg shadow-cyan-500/50'
                                        : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: color }}
                            >
                                {selectedColor === color && (
                                    <Animated.View
                                        entering={FadeInUp.springify()}
                                        className="absolute inset-0 items-center justify-center"
                                    >
                                        <MaterialIcons name="check" size={24} color="white" />
                                    </Animated.View>
                                )}
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};

export const CreateForm = ({ visible, onCreate, isCreating, onCancel }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        console.log(' Création:', {
            name: name.trim().toUpperCase(),
            color: selectedColor,
            icon: selectedIcon
        });
        await onCreate(name.trim().toUpperCase(), selectedColor, selectedIcon || undefined);
        setName('');
        setSelectedColor(COLOR_PALETTE[0]);
        setSelectedIcon(null);
    };

    const handleClose = () => {
        setName('');
        setSelectedColor(COLOR_PALETTE[0]);
        setSelectedIcon(null);
        onCancel();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View className="flex-1 bg-black/90">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={handleClose}
                    className="flex-1"
                />

                <Animated.View
                    entering={SlideInDown.springify().damping(15)}
                    className={`rounded-t-3xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                    style={{
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -3 },
                        shadowOpacity: 0.1,
                        shadowRadius: 5,
                        elevation: 10,
                    }}
                >
                    <View className="items-center pt-2">
                        <View className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                    </View>

                    <View className={`px-5 pt-4 pb-2 ${theme === 'dark' ? 'bg-gray-800' : 'bg-cyan-50'}`}>
                        <View className="flex-row items-center">
                            <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                                }`}>
                                <MaterialIcons
                                    name="add-circle"
                                    size={20}
                                    color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                                />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    Nouveau label
                                </Text>
                                <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Créez un label avec une icône et une couleur
                                </Text>
                            </View>
                            <TouchableOpacity
                                onPress={handleClose}
                                className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                                <MaterialIcons
                                    name="close"
                                    size={18}
                                    color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View className="px-5 py-4">
                        <View
                            className="mb-4 p-3 rounded-xl border"
                            style={{
                                backgroundColor: selectedColor + '15',
                                borderColor: theme === 'dark' ? '#374151' : '#e5e7eb'
                            }}
                        >
                            <View className="flex-row items-center">
                                <View
                                    className="w-10 h-10 rounded-lg items-center justify-center mr-3"
                                    style={{ backgroundColor: selectedColor }}
                                >
                                    <MaterialIcons
                                        name={selectedIcon as any || 'label'}
                                        size={18}
                                        color="white"
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {name.trim() || "Nouveau label"}
                                    </Text>
                                    <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {selectedIcon ? `Icône: ${AVAILABLE_ICONS.find(i => i.name === selectedIcon)?.label || selectedIcon}` : 'Aperçu en temps réel'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Nom du label
                            </Text>
                            <TextInput
                                className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} 
                                    rounded-xl px-4 py-2.5 text-base border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
                                    ${isCreating ? 'opacity-50' : ''}`}
                                placeholder="ex: NOURRITURE"
                                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                                value={name}
                                onChangeText={setName}
                                autoFocus
                                editable={!isCreating}
                                maxLength={20}
                            />
                        </View>

                        <ColorPicker
                            selectedColor={selectedColor}
                            onSelectColor={setSelectedColor}
                        />

                        <IconPicker
                            selectedIcon={selectedIcon}
                            onSelectIcon={setSelectedIcon}
                        />
                    </View>

                    <View className={`px-5 py-3 flex-row justify-end border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        <TouchableOpacity
                            onPress={handleClose}
                            className="px-4 py-2 mr-2 rounded-lg bg-gray-500/20"
                            disabled={isCreating}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                Annuler
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isCreating || !name.trim()}
                            className={`px-4 py-2 rounded-lg flex-row items-center ${isCreating || !name.trim()
                                    ? 'bg-gray-400/20'
                                    : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                                }`}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            {isCreating ? (
                                <>
                                    <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                                    <Text className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Création...
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <MaterialIcons name="check" size={16} color="white" />
                                    <Text className="ml-2 text-sm font-medium text-white">
                                        Créer
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};