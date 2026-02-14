import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

interface Label {
    id: string;
    name: string;
    _isDeleting?: boolean;
}

interface Props {
    label: Label;
    isDefault: boolean;
    isUpdating?: boolean;
    onEdit: () => void;
    onDelete: () => void;
}

export const LabelCard = ({ label, isDefault, isUpdating, onEdit, onDelete }: Props) => {
    const { theme } = useTheme();

    if (label._isDeleting) {
        return (
            <View className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 dark:border-gray-800 opacity-50">
            <View className="flex-row items-center flex-1">
            <View className={`w-8 h-8 rounded-lg ${isDefault ? 'bg-purple-500/20' : 'bg-cyan-500/20'} items-center justify-center mr-3`}>
            <MaterialIcons
            name={isDefault ? 'star' : 'label'}
            size={16}
            color={isDefault
                ? (theme === 'dark' ? '#c084fc' : '#9333ea')
                : (theme === 'dark' ? '#06b6d4' : '#0891b2')
            }
            />
            </View>
            <View>
            <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}>
            {label.name}
            </Text>
            </View>
            </View>
            <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            </View>
        );
    }

    return (
        <View className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center flex-1">
        <View className={`w-8 h-8 rounded-lg ${isDefault ? 'bg-purple-500/20' : 'bg-cyan-500/20'} items-center justify-center mr-3`}>
        <MaterialIcons
        name={isDefault ? 'star' : 'label'}
        size={16}
        color={isDefault
            ? (theme === 'dark' ? '#c084fc' : '#9333ea')
            : (theme === 'dark' ? '#06b6d4' : '#0891b2')
        }
        />
        </View>
        <View>
        <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}>
        {label.name}
        </Text>
        {isDefault && (
            <Text className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
            Par défaut
            </Text>
        )}
        </View>
        </View>

        <View className="flex-row">
        <TouchableOpacity onPress={onEdit} className="p-2 mr-2" disabled={isUpdating}>
        <MaterialIcons
        name="edit"
        size={20}
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        </TouchableOpacity>

        {!isDefault && (
            <TouchableOpacity onPress={onDelete} className="p-2" disabled={isUpdating}>
            <MaterialIcons
            name="delete"
            size={20}
            color={theme === 'dark' ? '#f87171' : '#dc2626'}
            />
            </TouchableOpacity>
        )}
        </View>
        </View>
    );
};
