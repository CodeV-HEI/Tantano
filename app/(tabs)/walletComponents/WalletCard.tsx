import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { Wallet } from '@/types/wallet';

interface Props {
    wallet: Wallet & { _isArchiving?: boolean; _showDetails?: boolean };
    style: any;
    isUpdating: boolean;
    isUpdatingIncome: boolean;
    isExpanded: boolean;
    isPremium: boolean;
    isShowingIncomeForm: boolean;
    onToggleDetails: () => void;
    onToggleActive: () => void;
    onToggleIncomeForm: () => void;
    onArchive?: () => void;
    children?: React.ReactNode;
}

export const WalletCard = ({
    wallet,
    style,
    isUpdating,
    isUpdatingIncome,
    isExpanded,
    isPremium,
    isShowingIncomeForm,
    onToggleDetails,
    onToggleActive,
    onToggleIncomeForm,
    onArchive,
    children
}: Props) => {
    const { theme } = useTheme();


    if (wallet._isArchiving) {
        return (
            <View className="relative mb-3 opacity-50">
            <View className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-4 border border-gray-300 dark:border-gray-700`}>
            <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-xl mr-3" style={{ backgroundColor: wallet.color }} />
            <View className="flex-1">
            <Text className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {wallet.name}
            </Text>
            </View>
            <View className="flex-row items-center">
            <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            <Text className="ml-2 text-xs text-gray-500">Archivage...</Text>
            </View>
            </View>
            </View>
            </View>
        );
    }

    return (
        <View className="relative mb-3">

        {(isUpdating || isUpdatingIncome) && (
            <View className="absolute inset-0 bg-black/50 rounded-2xl z-10 items-center justify-center">
            <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            </View>
        )}


        <TouchableOpacity onPress={onToggleDetails} activeOpacity={0.7}>
        <View className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-4 border ${
            wallet.isActive
            ? theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-300/30'
            : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
        <View className="flex-row items-center">

        <View
        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
        style={{ backgroundColor: wallet.color }}
        >
        <MaterialIcons
        name={style.icon}
        size={24}
        color="white"
        />
        </View>

        <View className="flex-1">
        <View className="flex-row items-center">
        <Text className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {wallet.name}
        </Text>
        {!wallet.isActive && (
            <View className={`ml-2 px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Inactif
            </Text>
            </View>
        )}
        {isPremium && (
            <View className="ml-2">
            <MaterialIcons name="stars" size={18} color={theme === 'dark' ? '#fbbf24' : '#d97706'} />
            </View>
        )}
        </View>

        {wallet.description && (
            <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
            {wallet.description}
            </Text>
        )}

        <View className="flex-row items-center justify-between mt-2">
        <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {wallet.amount.toLocaleString('fr-FR')} Ar
        </Text>
        <View className={`px-3 py-1 rounded-full`} style={{ backgroundColor: wallet.color + '30' }}>
        <Text className={`text-xs font-bold`} style={{ color: wallet.color }}>
        {wallet.type.replace('_', ' ')}
        </Text>
        </View>
        </View>
        </View>


        <MaterialIcons
        name={isExpanded ? 'expand-less' : 'expand-more'}
        size={24}
        color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
        />
        </View>
        </View>
        </TouchableOpacity>


        {isExpanded && (
            <View className={`mt-2 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'} rounded-2xl p-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>

            <View className="flex-row mb-4">
            <TouchableOpacity
            onPress={onToggleActive}
            className={`flex-1 flex-row items-center justify-center p-3 mr-2 rounded-xl ${
                wallet.isActive
                ? theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                : theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
            }`}
            >
            <MaterialIcons
            name={wallet.isActive ? 'visibility-off' : 'visibility'}
            size={20}
            color={wallet.isActive
                ? (theme === 'dark' ? '#f87171' : '#dc2626')
                : (theme === 'dark' ? '#4ade80' : '#16a34a')
            }
            />
            <Text className={`ml-2 font-medium ${
                wallet.isActive
                ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                : theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
            {wallet.isActive ? 'Désactiver' : 'Activer'}
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={onToggleIncomeForm}
            className={`flex-1 flex-row items-center justify-center p-3 rounded-xl ${
                theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}
            >
            <MaterialIcons
            name="auto-awesome"
            size={20}
            color={theme === 'dark' ? '#c084fc' : '#9333ea'}
            />
            <Text className={`ml-2 font-medium ${
                theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
            {isPremium ? 'Modifier' : 'Revenu auto'}
            </Text>
            </TouchableOpacity>
            </View>


            {onArchive && (
                <TouchableOpacity
                onPress={onArchive}
                className="flex-row items-center justify-center p-3 rounded-xl bg-red-500/10 border border-red-500/30"
                >
                <MaterialIcons name="archive" size={20} color={theme === 'dark' ? '#f87171' : '#dc2626'} />
                <Text className={`ml-2 font-medium ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}>
                Archiver ce portefeuille
                </Text>
                </TouchableOpacity>
            )}

            {children}
            </View>
        )}
        </View>
    );
};
