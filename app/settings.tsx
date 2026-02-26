import { useCurrency } from '@/context/CurrencyContext';
import { useTheme } from '@/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    ScrollView,
    StatusBar,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';


export default function SettingsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { currency, isLoading, updateCurrency, formatCurrency, currencies  } = useCurrency();
    
    
 
  const handleCurrencyChange = async (currency: typeof currencies[0]) => {
        try {
            await updateCurrency(currency);
            setIsCurrencyModalVisible(false);
        } catch (e) {
            console.error('Failed to save currency', e);
        }
    };

    // States for Currency
    const [isCurrencyModalVisible, setIsCurrencyModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // States for Notifications
    const [recurrence, setRecurrence] = useState('Semaine');
    const [isRecurrenceModalVisible, setIsRecurrenceModalVisible] = useState(false);
    const [daysCount, setDaysCount] = useState('30');

    // States for Biometrics
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    const filteredCurrencies = currencies
    ? currencies.filter(c => 
        c?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c?.value?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

    const SettingItem = ({
        icon,
        title,
        description,
        rightComponent
    }: {
        icon: keyof typeof MaterialIcons.glyphMap;
        title: string;
        description?: string;
        rightComponent?: React.ReactNode;
    }) => (
        <View className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 dark:border-gray-800">
            <View className="flex-row items-center flex-1">
                <View className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/10'} items-center justify-center mr-3`}>
                    <MaterialIcons name={icon} size={22} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                </View>
                <View className="flex-1">
                    <Text className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}>{title}</Text>
                    {description && (
                        <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mt-0.5`}>{description}</Text>
                    )}
                </View>
            </View>
            {rightComponent}
        </View>
    );

    return (
        <View className="flex-1 bg-white dark:bg-black">
            {/* Background Decorations */}
            <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
            <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

            {/* Back Button */}
            <TouchableOpacity 
                onPress={() => router.push('/profile')}
                className="absolute top-12 left-4 z-10 w-10 h-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
            >
                <MaterialIcons name="arrow-back" size={24} color={theme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>

            <ScrollView className="flex-1 pt-24 px-4">
                <Animated.View entering={FadeInUp.duration(600)}>
                    
                    {/* Section: Devise */}
                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>DEVISE</Text>
                        
                        <TouchableOpacity onPress={() => setIsCurrencyModalVisible(true)}>
                            <SettingItem
                                icon="attach-money"
                                title="Devise principale"
                                description={currency?.label}
                                rightComponent={
                                    <View className="flex-row items-center">
                                        <Text className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-medium mr-1`}>
                                            {currency?.value}
                                        </Text>
                                        <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
                                    </View>
                                }
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Section: Notifications */}
                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>NOTIFICATIONS</Text>
                        
                        <TouchableOpacity onPress={() => setIsRecurrenceModalVisible(true)}>
                            <SettingItem
                                icon="repeat"
                                title="Récurrence"
                                description="Fréquence des notifications"
                                rightComponent={
                                    <View className="flex-row items-center">
                                        <Text className={`${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'} font-medium mr-1`}>
                                            {recurrence}
                                        </Text>
                                        <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
                                    </View>
                                }
                            />
                        </TouchableOpacity>

                        <SettingItem
                            icon="calendar-today"
                            title="Période de calcul"
                            description="Nombre de jours pour les dépenses"
                            rightComponent={
                                <TextInput
                                    value={daysCount}
                                    onChangeText={setDaysCount}
                                    keyboardType="numeric"
                                    className={`w-16 h-8 text-right font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                                    placeholderTextColor="#9ca3af"
                                />
                            }
                        />
                    </View>

                    {/* Section: Biométrie */}
                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>SÉCURITÉ</Text>
                        
                        <SettingItem
                            icon="fingerprint"
                            title="Biométrie"
                            description="Activer l'empreinte ou FaceID"
                            rightComponent={
                                <Switch
                                    value={isBiometricEnabled}
                                    onValueChange={setIsBiometricEnabled}
                                    trackColor={{ false: '#d1d5db', true: theme === 'dark' ? '#06b6d4' : '#0891b2' }}
                                    thumbColor="#ffffff"
                                />
                            }
                        />
                    </View>

                </Animated.View>
            </ScrollView>

            {/* Modal: Currency Selection */}
            <Modal visible={isCurrencyModalVisible} animationType="slide" transparent={true}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className={`h-3/4 rounded-t-3xl p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Choisir une devise</Text>
                            <TouchableOpacity onPress={() => setIsCurrencyModalVisible(false)}>
                                <MaterialIcons name="close" size={24} color={theme === 'dark' ? 'white' : 'black'} />
                            </TouchableOpacity>
                        </View>
                        
                        <View className={`flex-row items-center px-4 py-2 rounded-xl mb-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <MaterialIcons name="search" size={20} color="#9ca3af" />
                            <TextInput
                                placeholder="Rechercher une devise..."
                                placeholderTextColor="#9ca3af"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                className={`flex-1 ml-2 py-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                            />
                        </View>

                        <FlatList
                            data={filteredCurrencies}
                            keyExtractor={(item) => item?.value}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    onPress={() => {
                                        handleCurrencyChange(item);
                                        setIsCurrencyModalVisible(false);
                                    }}
                                    className="py-4 border-b border-gray-100 dark:border-gray-800"
                                >
                                    <Text className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        {item?.label} ({item?.value})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {/* Modal: Recurrence Selection */}
            <Modal visible={isRecurrenceModalVisible} animationType="fade" transparent={true}>
                <TouchableOpacity 
                    activeOpacity={1} 
                    onPress={() => setIsRecurrenceModalVisible(false)}
                    className="flex-1 justify-center items-center bg-black/50 px-6"
                >
                    <View className={`w-full rounded-2xl p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                        <Text className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Récurrence</Text>
                        {['Jour', 'Semaine', 'Mois'].map((option) => (
                            <TouchableOpacity 
                                key={option}
                                onPress={() => {
                                    setRecurrence(option);
                                    setIsRecurrenceModalVisible(false);
                                }}
                                className="py-4 border-b border-gray-100 dark:border-gray-800"
                            >
                                <Text className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>

        </View>
    );
}
