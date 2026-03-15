import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function AboutScreen() {
    const { theme } = useTheme();
    const router = useRouter();

    React.useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    return (
        <View className={`flex-1 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
            <TouchableOpacity
                onPress={() => router.back()}
                className={`absolute top-12 left-4 z-10 w-10 h-10 items-center justify-center rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}
            >
                <MaterialIcons name="arrow-back" size={24} color={theme === 'dark' ? 'white' : 'black'} />
            </TouchableOpacity>

            <ScrollView className="flex-1 pt-20 px-4">
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text className={`text-3xl font-bold text-center mb-6 ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                        À propos de Tantano
                    </Text>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-6 mb-6`}>
                        <Text className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Tantano est une application de gestion financière personnelle qui vous aide à suivre vos dépenses, vos revenus et à atteindre vos objectifs d&apos;épargne.
                        </Text>
                        <Text className={`text-lg mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Développée avec ❤️ par CodeV.
                        </Text>
                        <Text className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Version : 1.0.0
                        </Text>
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-6`}>
                        <Text className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                            Technologies utilisées
                        </Text>
                        <Text className={`text-base mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>• React Native / Expo</Text>
                        <Text className={`text-base mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>• TailwindCSS (NativeWind)</Text>
                        <Text className={`text-base mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>• TypeScript</Text>
                        <Text className={`text-base mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>• Node.js / Express</Text>
                        <Text className={`text-base ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>• PostgreSQL</Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}