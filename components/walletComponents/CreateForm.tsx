import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { WalletType } from '@/types/api';
import { WALLET_COLOR_PALETTE } from '@/types/wallet';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IconPicker, AVAILABLE_WALLET_ICONS } from './IconPIcker';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Animated, { FadeInUp, FadeInDown, SlideInDown } from 'react-native-reanimated';

interface Props {
    visible: boolean;
    onCreate: (name: string, description: string, type: WalletType, color: string, iconRef?: string) => Promise<void>;
    isCreating: boolean;
    onCancel: () => void;
    getWalletTypeStyle: (type: WalletType) => any;
}

const TYPE_OPTIONS = [
    { 
        value: WalletType.CASH, 
        label: 'Espèces', 
        description: 'Argent liquide',
        icon: '💰'
    },
    { 
        value: WalletType.MOBILE_MONEY, 
        label: 'Mobile Money', 
        description: 'Orange Money, Mvola, etc.',
        icon: '📱'
    },
    { 
        value: WalletType.BANK, 
        label: 'Banque', 
        description: 'Compte bancaire',
        icon: '🏦'
    },
    { 
        value: WalletType.DEBT, 
        label: 'Dette', 
        description: 'Argent dû ou à recevoir',
        icon: '⚠️'
    },
];

const TypeSelector = ({ selectedType, onSelectType, getWalletTypeStyle }: { 
    selectedType: WalletType; 
    onSelectType: (type: WalletType) => void;
    getWalletTypeStyle: (type: WalletType) => any;
}) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = TYPE_OPTIONS.find(opt => opt.value === selectedType) || TYPE_OPTIONS[0];
    const selectedStyle = getWalletTypeStyle(selectedType);

    const handleSelectType = (type: WalletType) => {
        onSelectType(type);
        setIsOpen(false);
    };

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row items-center justify-between p-3 rounded-lg border"
                style={{ 
                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                    backgroundColor: selectedStyle.bg || 'transparent'
                }}
            >
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-lg items-center justify-center mr-3">
                        <Text className="text-lg">{selectedOption.icon}</Text>
                    </View>
                    <View>
                        <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {selectedOption.label}
                        </Text>
                        <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedOption.description}
                        </Text>
                    </View>
                </View>
                <MaterialIcons 
                    name={isOpen ? 'expand-less' : 'expand-more'} 
                    size={24} 
                    color={selectedStyle.text || (theme === 'dark' ? '#9ca3af' : '#6b7280')} 
                />
            </TouchableOpacity>

            {isOpen && (
                <Animated.View 
                    entering={FadeInDown.springify()}
                    className="mt-2 rounded-lg border overflow-hidden"
                    style={{ 
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff'
                    }}
                >
                    {TYPE_OPTIONS.map((option, index) => {
                        const style = getWalletTypeStyle(option.value);
                        const isSelected = selectedType === option.value;
                        
                        return (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => handleSelectType(option.value)}
                                className={`flex-row items-center p-3 ${
                                    index < TYPE_OPTIONS.length - 1 ? 'border-b' : ''
                                }`}
                                style={{ 
                                    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                                    backgroundColor: isSelected 
                                        ? (style.bg || (theme === 'dark' ? '#374151' : '#f3f4f6'))
                                        : 'transparent'
                                }}
                            >
                                <View className="w-8 h-8 rounded-lg items-center justify-center mr-3">
                                    <Text className="text-lg">{option.icon}</Text>
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-sm font-medium ${
                                        isSelected 
                                            ? style.text || (theme === 'dark' ? 'text-white' : 'text-gray-900')
                                            : theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {option.label}
                                    </Text>
                                    <Text className={`text-xs ${
                                        isSelected 
                                            ? style.text ? style.text + '/80' : (theme === 'dark' ? 'text-gray-300' : 'text-gray-600')
                                            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                        {option.description}
                                    </Text>
                                </View>
                                {isSelected && (
                                    <MaterialIcons 
                                        name="check" 
                                        size={20} 
                                        color={style.text || (theme === 'dark' ? '#06b6d4' : '#0891b2')} 
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </Animated.View>
            )}
        </View>
    );
};

const ColorPicker = ({ selectedColor, onSelectColor }: { 
    selectedColor: string; 
    onSelectColor: (color: string) => void;
}) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row items-center justify-between p-3 rounded-lg border"
                style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
            >
                <View className="flex-row items-center">
                    <View className="w-8 h-8 rounded-full mr-3" style={{ backgroundColor: selectedColor }} />
                    <Text className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Couleur
                    </Text>
                </View>
                <MaterialIcons 
                    name={isOpen ? 'expand-less' : 'expand-more'} 
                    size={24} 
                    color={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                />
            </TouchableOpacity>

            {isOpen && (
                <Animated.View entering={FadeInDown.springify()} className="mt-2 p-3 rounded-lg border" style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
                        {WALLET_COLOR_PALETTE.map((color) => (
                            <TouchableOpacity
                                key={color}
                                onPress={() => {
                                    onSelectColor(color);
                                    setIsOpen(false);
                                }}
                                className="mr-3"
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
                </Animated.View>
            )}
        </View>
    );
};

export const CreateForm = ({ visible, onCreate, isCreating, onCancel, getWalletTypeStyle }: Props) => {
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState<WalletType>(WalletType.CASH);
    const [selectedColor, setSelectedColor] = useState(WALLET_COLOR_PALETTE[0]);
    const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        
        const finalDescription = description.trim() || '';
        
        console.log('💰 Création wallet:', { 
            name: name.trim(), 
            description: finalDescription, 
            type, 
            color: selectedColor,
            icon: selectedIcon 
        });
        
        await onCreate(name.trim(), finalDescription, type, selectedColor, selectedIcon || undefined);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setType(WalletType.CASH);
        setSelectedColor(WALLET_COLOR_PALETTE[0]);
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
                    style={{ maxHeight: '90%' }}
                >
                    <View className="items-center pt-2 pb-1">
                        <View className={`w-10 h-1 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`} />
                    </View>

                    <View className={`px-4 py-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-cyan-50'} flex-row justify-between items-center`}>
                        <View className="flex-row items-center">
                            <View className={`w-8 h-8 rounded-lg items-center justify-center mr-2 ${
                                theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-100'
                            }`}>
                                <MaterialIcons name="add-card" size={18} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                            </View>
                            <Text className={`text-base font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                Nouveau portefeuille
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
                                        name={selectedIcon as any || 'account-balance-wallet'} 
                                        size={18} 
                                        color="white" 
                                    />
                                </View>
                                <View className="flex-1">
                                    <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {name.trim() || "Nouveau portefeuille"}
                                    </Text>
                                    <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {TYPE_OPTIONS.find(t => t.value === type)?.label}
                                        {description ? ` • ${description}` : ''}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View className="mb-3">
                            <Text className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Nom <Text className="text-red-500">*</Text>
                            </Text>
                            <TextInput
                                className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} 
                                    rounded-lg px-3 py-2 text-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                                placeholder="ex: Épargne"
                                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                                value={name}
                                onChangeText={setName}
                                autoFocus
                                editable={!isCreating}
                            />
                        </View>

                        <View className="mb-3">
                            <Text className={`text-xs font-medium mb-1 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Description <Text className="text-gray-400 text-xs">(optionnelle)</Text>
                            </Text>
                            <TextInput
                                className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} 
                                    rounded-lg px-3 py-2 text-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                                placeholder="ex: Pour les dépenses quotidiennes"
                                placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                                value={description}
                                onChangeText={setDescription}
                                editable={!isCreating}
                            />
                        </View>

                        <TypeSelector
                            selectedType={type}
                            onSelectType={setType}
                            getWalletTypeStyle={getWalletTypeStyle}
                        />

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
                                        Créer le portefeuille
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