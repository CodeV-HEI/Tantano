import SettingItem from '@/components/SettingItem';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useNotification } from '@/contexts/NotificationContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Currency } from '@/services/api';
import { Recurrence } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
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
import { useSettings } from '@/hooks/useSettings';
import { useAuth } from '@/contexts/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';

const RECURRENCE_OPTIONS: { value: Recurrence; label: string }[] = [
    { value: "daily", label: "Quotidien" },
    { value: "weekly", label: "Hebdomadaire" },
    { value: "monthly", label: "Mensuel" },
];


export default function SettingsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { currency, isLoading, updateCurrency, currencies } = useCurrency();
    const { settings, updateSettings } = useSettings();
    const {
        recurrence,
        calculePeriod,
        setRecurrence,
        setCalculePeriod,
        setFreshAmount
    } = useNotification();
    const { biometricsAvailable } = useAuth();
    const [isBiometricActivating, setIsBiometricActivating] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setFreshAmount();
            return () => {
                setFreshAmount();
            };
        }, [setFreshAmount])
    );

    const handleBiometricToggle = async (value: boolean) => {
        if (value) {
            setIsBiometricActivating(true);
            try {
                const result = await LocalAuthentication.authenticateAsync({
                    promptMessage: 'Authentifiez-vous pour activer la connexion biométrique',
                    cancelLabel: 'Annuler',
                    disableDeviceFallback: false,
                });
                if (result.success) {
                    await updateSettings({ biometricsEnabled: true });
                }
            } catch (error) {
                console.error('Erreur lors de l’activation biométrique', error);
            } finally {
                setIsBiometricActivating(false);
            }
        } else {
            // Désactivation simple
            await updateSettings({ biometricsEnabled: false });
        }
    };

    const handleCurrencyChange = async (currency: Currency) => {
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
    const [isRecurrenceModalVisible, setIsRecurrenceModalVisible] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [daysCount, setDaysCount] = useState('30');

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    const filteredCurrencies = currencies
        ? currencies.filter(c =>
            c?.label?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c?.value?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];


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
                                    value={calculePeriod.toString()}
                                    onChangeText={(text) => setCalculePeriod(parseInt(text) || 1)}
                                    keyboardType="numeric"
                                    className={`w-16 h-8 text-right font-medium ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}
                                    placeholderTextColor="#9ca3af"
                                />
                            }
                        />
                    </View>

                    {/* Section Sécurité */}
                    {biometricsAvailable && (
                        <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-6`}>
                            <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
                                SÉCURITÉ
                            </Text>
                            <SettingItem
                                icon="fingerprint"
                                title="Biométrie"
                                description="Activer l'empreinte ou FaceID"
                                rightComponent={
                                    <Switch
                                        value={settings.biometricsEnabled}
                                        onValueChange={handleBiometricToggle}
                                        disabled={isBiometricActivating}
                                        trackColor={{ false: '#d1d5db', true: theme === 'dark' ? '#06b6d4' : '#0891b2' }}
                                        thumbColor="#ffffff"
                                    />
                                }
                            />
                        </View>
                    )}

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
                        {RECURRENCE_OPTIONS.map(({ value, label }) => (
                            <TouchableOpacity
                                key={value}
                                onPress={() => {
                                    setRecurrence(value);
                                    setIsRecurrenceModalVisible(false);
                                }}
                                className="py-4 border-b border-gray-100 dark:border-gray-800"
                            >
                                <Text className={`text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                    {label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}