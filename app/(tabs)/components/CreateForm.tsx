import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { COLOR_PALETTE } from '@/types/label';
import Animated, { FadeInUp, FadeInDown, SlideInDown } from 'react-native-reanimated';
import { IconPicker, AVAILABLE_ICONS } from './IconPicker';
import { ColorPicker } from './ColorPicker';  

interface Props {
    visible: boolean;
    onCreate: (name: string, color: string, iconRef?: string) => Promise<void>;
    isCreating: boolean;
    onCancel: () => void;
}

export const CreateForm = ({ visible, onCreate, isCreating, onCancel }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [selectedColor, setSelectedColor] = useState(COLOR_PALETTE[0]);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        console.log('Création:', {
            name: name.trim().toUpperCase(),
            color: selectedColor,
            icon: selectedIcon
        });
        await onCreate(name.trim().toUpperCase(), selectedColor, selectedIcon || undefined);
        resetForm();
    };

    const resetForm = () => {
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
            onRequestClose={resetForm}
        >
            <View className="flex-1 bg-black/90">
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={resetForm}
                    className="flex-1"
                />

                <Animated.View
                    entering={SlideInDown.springify().damping(15)}
                    className={`rounded-t-2xl overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                    style={{
                        maxHeight: '80%',
                    }}
                >
                    <View className="items-center pt-2 pb-1">
                        <View className={`w-10 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                    </View>

                    <View className={`px-4 py-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-cyan-50'} flex-row justify-between items-center`}>
                        <View className="flex-row items-center">
                            <View className={`w-8 h-8 rounded-lg items-center justify-center mr-2 ${
                                theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                            }`}>
                                <MaterialIcons
                                    name="add-circle"
                                    size={18}
                                    color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                                />
                            </View>
                            <Text className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Nouveau label
                            </Text>
                        </View>
                        <TouchableOpacity onPress={resetForm} className="p-1">
                            <MaterialIcons name="close" size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-4 py-3" showsVerticalScrollIndicator={false}>
                        <View
                            className="mb-3 p-3 rounded-lg border"
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
                                    <Text className={`text-sm font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {name.trim().toUpperCase() || "NOUVEAU LABEL"}
                                    </Text>
                                    <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {selectedIcon ? `Icône: ${AVAILABLE_ICONS.find(i => i.name === selectedIcon)?.label || selectedIcon}` : 'Aperçu en temps réel'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-4">
                            <Text className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Nom du label <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} 
                                    rounded-lg px-3 py-2 text-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}
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
                    </ScrollView>

                    <View className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={isCreating || !name.trim()}
                            className={`py-3 rounded-xl flex-row items-center justify-center ${
                                isCreating || !name.trim()
                                    ? 'bg-gray-400/20'
                                    : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                            }`}
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
                                    <MaterialIcons name="check" size={18} color="white" />
                                    <Text className="ml-2 text-sm font-medium text-white">
                                        Créer le label
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