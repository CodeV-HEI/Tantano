import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInUp, SlideInDown } from 'react-native-reanimated';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
}

export const ConfirmationModal = ({ 
    visible, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    confirmColor = 'red'
}: Props) => {
    const { theme } = useTheme();

    const getConfirmButtonClass = () => {
        switch(confirmColor) {
            case 'red': return 'bg-red-500/20 border-red-500/30';
            case 'blue': return 'bg-blue-500/20 border-blue-500/30';
            case 'green': return 'bg-green-500/20 border-green-500/30';
            default: return 'bg-red-500/20 border-red-500/30';
        }
    };

    const getConfirmTextClass = () => {
        switch(confirmColor) {
            case 'red': return 'text-red-600 dark:text-red-400';
            case 'blue': return 'text-blue-600 dark:text-blue-400';
            case 'green': return 'text-green-600 dark:text-green-400';
            default: return 'text-red-600 dark:text-red-400';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/50 justify-center items-center">
                <Animated.View 
                    entering={SlideInDown.springify().damping(15)}
                    className={`w-11/12 max-w-md rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}
                >
                    <View className="items-center mb-4">
                        <View className={`w-16 h-16 rounded-full items-center justify-center ${getConfirmButtonClass()}`}>
                            <MaterialIcons 
                                name="archive" 
                                size={32} 
                                color={confirmColor === 'red' ? '#ef4444' : (confirmColor === 'blue' ? '#3b82f6' : '#10b981')} 
                            />
                        </View>
                    </View>

                    <Text className={`text-xl font-bold text-center mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {title}
                    </Text>

                    <Text className={`text-center mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {message}
                    </Text>

                    <View className="flex-row justify-end">
                        <TouchableOpacity
                            onPress={onCancel}
                            className={`flex-1 mr-2 py-3 rounded-xl ${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                            }`}
                        >
                            <Text className={`text-center font-medium ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                            }`}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`flex-1 ml-2 py-3 rounded-xl border ${getConfirmButtonClass()}`}
                        >
                            <Text className={`text-center font-medium ${getConfirmTextClass()}`}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};