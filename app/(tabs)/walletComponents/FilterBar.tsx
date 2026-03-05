import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { WalletType } from '@/types/api';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Props {
    filterType: 'ALL' | WalletType;
    onFilterTypeChange: (type: 'ALL' | WalletType) => void;
    showInactive: boolean;
    onShowInactiveChange: () => void;
    getWalletTypeStyle: (type: WalletType) => any;
}

const TYPE_OPTIONS = [
    { value: 'ALL' as const, label: 'Tous', icon: 'apps' },
    { value: WalletType.CASH, label: 'Espèces', icon: 'money' },
    { value: WalletType.MOBILE_MONEY, label: 'Mobile', icon: 'phone-android' },
    { value: WalletType.BANK, label: 'Banque', icon: 'account-balance' },
    { value: WalletType.DEBT, label: 'Dette', icon: 'warning' },
];

export const FilterBar = ({ 
    filterType, 
    onFilterTypeChange, 
    showInactive, 
    onShowInactiveChange,
    getWalletTypeStyle 
}: Props) => {
    const { theme } = useTheme();
    const [typePickerVisible, setTypePickerVisible] = useState(false);

    const selectedOption = TYPE_OPTIONS.find(opt => opt.value === filterType) || TYPE_OPTIONS[0];

    return (
        <>
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity
                    onPress={() => setTypePickerVisible(true)}
                    className="flex-1 flex-row items-center justify-between mr-2 px-4 py-3 rounded-xl border"
                    style={{ 
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb'
                    }}
                >
                    <View className="flex-row items-center">
                        <MaterialIcons 
                            name={selectedOption.icon as any} 
                            size={20} 
                            color={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                        />
                        <Text className={`ml-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {selectedOption.label}
                        </Text>
                    </View>
                    <MaterialIcons 
                        name="arrow-drop-down" 
                        size={24} 
                        color={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onShowInactiveChange}
                    className={`px-4 py-3 rounded-xl border flex-row items-center ${
                        showInactive
                            ? theme === 'dark'
                                ? 'bg-red-500/20 border-red-500/30'
                                : 'bg-red-100 border-red-300'
                            : theme === 'dark'
                                ? 'bg-green-500/20 border-green-500/30'
                                : 'bg-green-100 border-green-300'
                    }`}
                >
                    <MaterialIcons 
                        name={showInactive ? 'visibility-off' : 'visibility'} 
                        size={20} 
                        color={showInactive
                            ? (theme === 'dark' ? '#f87171' : '#dc2626')
                            : (theme === 'dark' ? '#4ade80' : '#16a34a')
                        } 
                    />
                </TouchableOpacity>
            </View>

            <Modal
                visible={typePickerVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setTypePickerVisible(false)}
            >
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => setTypePickerVisible(false)}
                    className="flex-1 bg-black/50"
                >
                    <Animated.View 
                        entering={FadeInDown.springify()}
                        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-t-3xl p-4"
                    >
                        <View className="items-center mb-4">
                            <View className={`w-12 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                        </View>

                        <Text className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Filtrer par type
                        </Text>

                        {TYPE_OPTIONS.map((option, index) => {
                            const isSelected = filterType === option.value;
                            const style = option.value !== 'ALL' 
                                ? getWalletTypeStyle(option.value as WalletType)
                                : null;

                            return (
                                <TouchableOpacity
                                    key={option.value}
                                    onPress={() => {
                                        onFilterTypeChange(option.value as any);
                                        setTypePickerVisible(false);
                                    }}
                                    className={`flex-row items-center p-4 rounded-xl mb-2 ${
                                        isSelected
                                            ? option.value === 'ALL'
                                                ? theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                                                : style?.bg || ''
                                            : ''
                                    }`}
                                >
                                    <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${
                                        isSelected
                                            ? option.value === 'ALL'
                                                ? theme === 'dark' ? 'bg-cyan-500/30' : 'bg-cyan-200'
                                                : style?.bg || ''
                                            : theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                    }`}>
                                        <MaterialIcons 
                                            name={option.icon as any} 
                                            size={24} 
                                            color={isSelected
                                                ? option.value === 'ALL'
                                                    ? (theme === 'dark' ? '#06b6d4' : '#0891b2')
                                                    : style?.text || (theme === 'dark' ? '#9ca3af' : '#6b7280')
                                                : theme === 'dark' ? '#9ca3af' : '#6b7280'
                                            } 
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className={`text-base font-medium ${
                                            isSelected
                                                ? option.value === 'ALL'
                                                    ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                                                    : style?.text || (theme === 'dark' ? 'text-white' : 'text-gray-900')
                                                : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                        }`}>
                                            {option.label}
                                        </Text>
                                        {option.value !== 'ALL' && (
                                            <Text className={`text-xs ${
                                                isSelected
                                                    ? style?.text ? style.text + '/80' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                                                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}>
                                                {option.value}
                                            </Text>
                                        )}
                                    </View>
                                    {isSelected && (
                                        <MaterialIcons 
                                            name="check" 
                                            size={24} 
                                            color={option.value === 'ALL'
                                                ? (theme === 'dark' ? '#06b6d4' : '#0891b2')
                                                : style?.text || (theme === 'dark' ? '#06b6d4' : '#0891b2')
                                            } 
                                        />
                                    )}
                                </TouchableOpacity>
                            );
                        })}

                        <TouchableOpacity
                            onPress={() => setTypePickerVisible(false)}
                            className={`mt-4 p-4 rounded-xl border ${
                                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'
                            }`}
                        >
                            <Text className={`text-center font-medium ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                Fermer
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </>
    );
};