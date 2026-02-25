import { useTheme } from '@/context/ThemeContext';
import { WalletType } from '@/types/wallet';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Props {
    filterType: 'ALL' | WalletType;
    onFilterTypeChange: (type: 'ALL' | WalletType) => void;
    showInactive: boolean;
    onShowInactiveChange: () => void;
    getWalletTypeStyle: (type: WalletType) => any;
}

export const FilterBar = ({ 
    filterType, 
    onFilterTypeChange, 
    showInactive, 
    onShowInactiveChange,
    getWalletTypeStyle 
}: Props) => {
    const { theme } = useTheme();

    return (
        <View className="flex-row justify-between mb-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                {/* Bouton TOUS */}
                <TouchableOpacity
                    onPress={() => onFilterTypeChange('ALL')}
                    className={`mr-2 px-4 py-2 rounded-full border ${
                        filterType === 'ALL'
                            ? theme === 'dark'
                                ? 'bg-cyan-500/20 border-cyan-500'
                                : 'bg-cyan-400/20 border-cyan-400'
                            : theme === 'dark'
                                ? 'bg-gray-900/50 border-gray-700'
                                : 'bg-cyan-50/50 border-gray-200'
                    }`}
                >
                    <Text className={`font-medium ${
                        filterType === 'ALL'
                            ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        Tous
                    </Text>
                </TouchableOpacity>

                {/* Boutons par type */}
                {(['CASH', 'MOBILE_MONEY', 'BANK', 'DEBT'] as WalletType[]).map((type) => {
                    const style = getWalletTypeStyle(type);
                    return (
                        <TouchableOpacity
                            key={type}
                            onPress={() => onFilterTypeChange(type)}
                            className={`mr-2 px-4 py-2 rounded-full border ${
                                filterType === type
                                    ? style.bg + ' ' + style.border
                                    : theme === 'dark'
                                        ? 'bg-gray-900/50 border-gray-700'
                                        : 'bg-cyan-50/50 border-gray-200'
                            }`}
                        >
                            <Text className={`font-medium ${
                                filterType === type ? style.text : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                                {type.replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Bouton Actif/Inactif - CORRIGÉ */}
            <TouchableOpacity
                onPress={onShowInactiveChange}
                className={`px-4 py-2 rounded-full border ${
                    showInactive
                        ? theme === 'dark'
                            ? 'bg-red-500/20 border-red-500/30'
                            : 'bg-red-100 border-red-300'
                        : theme === 'dark'
                            ? 'bg-green-500/20 border-green-500/30'
                            : 'bg-green-100 border-green-300'
                }`}
            >
                <Text className={`font-medium ${
                    showInactive
                        ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        : theme === 'dark' ? 'text-green-400' : 'text-green-600'
                }`}>
                    {showInactive ? 'Inactifs' : 'Actifs'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};