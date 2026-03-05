import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export const AVAILABLE_ICONS = [
    { name: 'label', label: 'Label' },
    { name: 'star', label: 'Star' },
    { name: 'favorite', label: 'Favorite' },
    { name: 'restaurant', label: 'Restaurant' },
    { name: 'fastfood', label: 'Fast food' },
    { name: 'local-cafe', label: 'Café' },
    { name: 'local-bar', label: 'Bar' },
    { name: 'shopping-cart', label: 'Shopping' },
    { name: 'local-grocery-store', label: 'Groceries' },
    { name: 'train', label: 'Train' },
    { name: 'directions-car', label: 'Car' },
    { name: 'local-taxi', label: 'Taxi' },
    { name: 'flight', label: 'Flight' },
    { name: 'hotel', label: 'Hotel' },
    { name: 'local-hospital', label: 'Health' },
    { name: 'local-pharmacy', label: 'Pharmacy' },
    { name: 'fitness-center', label: 'Fitness' },
    { name: 'sports-soccer', label: 'Sports' },
    { name: 'movie', label: 'Movie' },
    { name: 'theaters', label: 'Theater' },
    { name: 'music-note', label: 'Music' },
    { name: 'games', label: 'Games' },
    { name: 'school', label: 'School' },
    { name: 'work', label: 'Work' },
    { name: 'business-center', label: 'Business' },
    { name: 'attach-money', label: 'Money' },
    { name: 'credit-card', label: 'Credit card' },
    { name: 'account-balance', label: 'Bank' },
    { name: 'payment', label: 'Payment' },
    { name: 'receipt', label: 'Receipt' },
    { name: 'shopping-bag', label: 'Bag' },
    { name: 'home', label: 'Home' },
    { name: 'family-restroom', label: 'Family' },
    { name: 'pets', label: 'Pets' },
    { name: 'checkroom', label: 'Clothing' },
    { name: 'electric-bolt', label: 'Electricity' },
    { name: 'water-drop', label: 'Water' },
    { name: 'local-gas-station', label: 'Gas' },
    { name: 'phone-android', label: 'Phone' },
    { name: 'computer', label: 'Computer' },
    { name: 'tv', label: 'TV' },
    { name: 'book', label: 'Book' },
    { name: 'menu-book', label: 'Education' },
    { name: 'celebration', label: 'Celebration' },
    { name: 'cake', label: 'Cake' },
    { name: 'card-giftcard', label: 'Gift' },
    { name: 'volunteer-activism', label: 'Donation' },
    { name: 'emoji-emotions', label: 'Happy' },
    { name: 'mood-bad', label: 'Sad' },
    { name: 'health-and-safety', label: 'Safety' },
];

interface Props {
    selectedIcon: string | null;
    onSelectIcon: (iconName: string | null) => void;
}

export const IconPicker = ({ selectedIcon, onSelectIcon }: Props) => {
    const { theme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectIcon = (iconName: string | null) => {
        onSelectIcon(iconName);
        setIsOpen(false);
    };

    const getSelectedIconLabel = () => {
        if (!selectedIcon) return 'Aucune icône';
        const icon = AVAILABLE_ICONS.find(i => i.name === selectedIcon);
        return icon?.label || selectedIcon;
    };

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() => setIsOpen(!isOpen)}
                className="flex-row items-center justify-between p-3 rounded-lg border"
                style={{ borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }}
            >
                <View className="flex-row items-center">
                    <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                        <MaterialIcons 
                            name={selectedIcon as any || 'image'} 
                            size={18} 
                            color={selectedIcon ? (theme === 'dark' ? '#06b6d4' : '#0891b2') : (theme === 'dark' ? '#9ca3af' : '#6b7280')} 
                        />
                    </View>
                    <View>
                        <Text className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            {selectedIcon ? 'Icône choisie' : 'Ajouter une icône'}
                        </Text>
                        {selectedIcon && (
                            <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {getSelectedIconLabel()}
                            </Text>
                        )}
                    </View>
                </View>
                <MaterialIcons 
                    name={isOpen ? 'expand-less' : 'expand-more'} 
                    size={24} 
                    color={theme === 'dark' ? '#9ca3af' : '#6b7280'} 
                />
            </TouchableOpacity>

            {isOpen && (
                <Animated.View 
                    entering={FadeInDown.springify()}
                    className="mt-2 p-3 rounded-lg border"
                    style={{ 
                        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
                        backgroundColor: theme === 'dark' ? '#1f2937' : '#f9fafb'
                    }}
                >
                    <TouchableOpacity
                        onPress={() => handleSelectIcon(null)}
                        className="flex-row items-center p-2 mb-2 rounded-lg"
                        style={{ 
                            backgroundColor: selectedIcon === null 
                                ? (theme === 'dark' ? '#06b6d420' : '#0891b220')
                                : 'transparent'
                        }}
                    >
                        <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${
                            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                            <MaterialIcons name="not-interested" size={16} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                        </View>
                        <Text className={`text-sm flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Aucune icône
                        </Text>
                        {selectedIcon === null && (
                            <MaterialIcons 
                                name="check" 
                                size={16} 
                                color={theme === 'dark' ? '#06b6d4' : '#0891b2'} 
                            />
                        )}
                    </TouchableOpacity>

                    <ScrollView 
                        style={{ maxHeight: 300 }}
                        showsVerticalScrollIndicator={true}
                    >
                        <View className="flex-row flex-wrap justify-between">
                            {AVAILABLE_ICONS.map((icon, index) => (
                                <Animated.View
                                    key={icon.name}
                                    entering={FadeInUp.delay(index * 20).springify()}
                                    style={{ width: '25%' }}
                                >
                                    <TouchableOpacity
                                        onPress={() => handleSelectIcon(icon.name)}
                                        className="items-center p-2 m-1 rounded-lg"
                                        style={{ 
                                            backgroundColor: selectedIcon === icon.name 
                                                ? (theme === 'dark' ? '#06b6d420' : '#0891b220')
                                                : 'transparent'
                                        }}
                                    >
                                        <View 
                                            className={`w-12 h-12 rounded-lg items-center justify-center mb-1 ${
                                                selectedIcon === icon.name
                                                    ? 'border-2 border-cyan-500'
                                                    : ''
                                            }`}
                                            style={{ 
                                                backgroundColor: selectedIcon === icon.name 
                                                    ? 'transparent'
                                                    : (theme === 'dark' ? '#374151' : '#e5e7eb')
                                            }}
                                        >
                                            <MaterialIcons 
                                                name={icon.name as any} 
                                                size={24} 
                                                color={selectedIcon === icon.name
                                                    ? (theme === 'dark' ? '#06b6d4' : '#0891b2')
                                                    : (theme === 'dark' ? '#9ca3af' : '#6b7280')
                                                } 
                                            />
                                        </View>
                                        <Text 
                                            className={`text-xs text-center ${
                                                selectedIcon === icon.name
                                                    ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                                                    : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                            numberOfLines={1}
                                            style={{ width: '100%' }}
                                        >
                                            {icon.label}
                                        </Text>
                                    </TouchableOpacity>
                                </Animated.View>
                            ))}
                        </View>
                    </ScrollView>
                </Animated.View>
            )}
        </View>
    );
};
