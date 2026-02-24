import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { WalletType } from '@/types/wallet';
import { WALLET_COLOR_PALETTE } from '@/types/wallet';
import Animated, { FadeInUp } from 'react-native-reanimated';

interface Props {
    onCreate: (name: string, description: string, type: WalletType, color: string) => Promise<void>;
    isCreating: boolean;
    onCancel: () => void;
    getWalletTypeStyle: (type: WalletType) => any;
}


const ColorPicker = ({ selectedColor, onSelectColor }: { selectedColor: string; onSelectColor: (color: string) => void }) => {
    const { theme } = useTheme();

    return (
        <View className="mb-4">
        <Text className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Couleur du portefeuille
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {WALLET_COLOR_PALETTE.map((color) => (
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

export const CreateForm = ({ onCreate, isCreating, onCancel, getWalletTypeStyle }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<WalletType>('CASH');
    const [selectedColor, setSelectedColor] = useState(WALLET_COLOR_PALETTE[0]);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        console.log(' Création wallet avec couleur:', selectedColor);
        await onCreate(name.trim(), description.trim(), type, selectedColor);
        setName('');
        setDescription('');
        setType('CASH');
        setSelectedColor(WALLET_COLOR_PALETTE[0]);
    };

    return (
        <Animated.View entering={FadeInUp}
        className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-4`}
        >
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-3`}>
        NOUVEAU PORTEFEUILLE
        </Text>

        <TextInput
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        placeholder="Nom du portefeuille *"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={name}
        onChangeText={setName}
        editable={!isCreating}
        />

        <TextInput
        className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}
        rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
        placeholder="Description (optionnelle)"
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={description}
        onChangeText={setDescription}
        editable={!isCreating}
        />


        <Text className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Type de portefeuille
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        {(['CASH', 'MOBILE_MONEY', 'BANK', 'DEBT'] as WalletType[]).map((walletType) => {
            const style = getWalletTypeStyle(walletType);
            return (
                <TouchableOpacity
                key={walletType}
                onPress={() => setType(walletType)}
                className={`mr-2 px-4 py-2 rounded-full ${
                    type === walletType
                    ? style.bg + ' ' + style.border
                    : theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-gray-100 border-gray-200'
                } border`}
                disabled={isCreating}
                >
                <Text className={`font-medium ${
                    type === walletType ? style.text : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {walletType.replace('_', ' ')}
                </Text>
                </TouchableOpacity>
            );
        })}
        </ScrollView>


        <ColorPicker
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
        />


        <View
        className="flex-row items-center p-3 rounded-xl mb-4"
        style={{ backgroundColor: selectedColor + '20' }}
        >
        <View className="w-8 h-8 rounded-lg mr-3" style={{ backgroundColor: selectedColor }} />
        <View className="flex-1">
        <Text className={`text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {name || "Nom du portefeuille"}
        </Text>
        <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
        {type.replace('_', ' ')} • Aperçu
        </Text>
        </View>
        </View>

        <View className="flex-row justify-end">
        <TouchableOpacity
        onPress={onCancel}
        className="px-4 py-2 mr-2 rounded-xl bg-red-500/20"
        disabled={isCreating}
        >
        <Text className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
        Annuler
        </Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={handleSubmit}
        disabled={isCreating || !name.trim()}
        className="px-4 py-2 rounded-xl bg-green-500/20"
        >
        {isCreating ? (
            <ActivityIndicator size="small" color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
        ) : (
            <Text className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
            Créer
            </Text>
        )}
        </TouchableOpacity>
        </View>
        </Animated.View>
    );
};
