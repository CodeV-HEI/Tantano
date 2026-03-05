import React from 'react';
import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    visible: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmationModal = ({ 
    visible, 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmText = 'Archiver',
    cancelText = 'Annuler'
}: Props) => {
    const { theme } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/50 justify-center items-center">
                <View className={`w-11/12 max-w-md rounded-2xl p-6 ${
                    theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                }`}>

                    <View className="items-center mb-4">
                        <View className={`w-16 h-16 rounded-full items-center justify-center ${
                            theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                        }`}>
                            <MaterialIcons 
                                name="archive" 
                                size={32} 
                                color={theme === 'dark' ? '#f87171' : '#dc2626'} 
                            />
                        </View>
                    </View>


                    <Text className={`text-xl font-bold text-center mb-2 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {title}
                    </Text>


                    <Text className={`text-center mb-6 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
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
                            className={`flex-1 ml-2 py-3 rounded-xl ${
                                theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                            }`}
                        >
                            <Text className={`text-center font-medium ${
                                theme === 'dark' ? 'text-red-400' : 'text-red-600'
                            }`}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};