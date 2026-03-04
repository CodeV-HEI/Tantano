import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import Animated, { FadeInDown } from 'react-native-reanimated';

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

    return (
        <View className="mb-4">
            <Text className={`text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                Choisir une icône (optionnel)
            </Text>

            <TouchableOpacity
                onPress={() => onSelectIcon(null)}
                className={`mb-3 p-2 rounded-lg border ${selectedIcon === null
                        ? theme === 'dark' ? 'border-cyan-500 bg-cyan-500/10' : 'border-cyan-500 bg-cyan-100'
                        : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}
            >
                <View className="flex-row items-center">
                    <View className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                        <MaterialIcons name="not-interested" size={18} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
                    </View>
                    <Text className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        Aucune icône
                    </Text>
                    {selectedIcon === null && (
                        <View className="ml-auto">
                            <MaterialIcons name="check" size={20} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                        </View>
                    )}
                </View>
            </TouchableOpacity>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="flex-row"
            >
                {AVAILABLE_ICONS.map((icon, index) => (
                    <Animated.View
                        key={icon.name}
                        entering={FadeInDown.delay(index * 20).springify()}
                    >
                        <TouchableOpacity
                            onPress={() => onSelectIcon(icon.name)}
                            className="mr-2 items-center"
                            style={{ width: 70 }}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                        >
                            <View
                                className={`w-14 h-14 rounded-xl items-center justify-center mb-1 border-2 ${selectedIcon === icon.name
                                        ? 'border-cyan-500 scale-105 shadow-lg shadow-cyan-500/50'
                                        : 'border-transparent'
                                    }`}
                                style={{
                                    backgroundColor: selectedIcon === icon.name
                                        ? (theme === 'dark' ? '#06b6d420' : '#0891b220')
                                        : (theme === 'dark' ? '#1f2937' : '#f3f4f6')
                                }}
                            >
                                <MaterialIcons
                                    name={icon.name as any}
                                    size={28}
                                    color={selectedIcon === icon.name
                                        ? (theme === 'dark' ? '#06b6d4' : '#0891b2')
                                        : (theme === 'dark' ? '#9ca3af' : '#6b7280')
                                    }
                                />
                            </View>
                            <Text
                                className={`text-xs text-center ${selectedIcon === icon.name
                                        ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
                                        : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                numberOfLines={1}
                                ellipsizeMode="tail"
                            >
                                {icon.label}
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>
                ))}
            </ScrollView>
        </View>
    );
};