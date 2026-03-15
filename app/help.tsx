import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function HelpScreen() {
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
                        Centre d&apos;aide
                    </Text>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-6 mb-6`}>
                        <Text className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                            Questions fréquentes
                        </Text>

                        <View className="mb-4">
                            <Text className={`text-base font-semibold mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Comment ajouter une transaction ?
                            </Text>
                            <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Rendez-vous dans l&apos;onglet &quot;Transactions&quot;, puis appuyez sur le bouton &quot;+&quot; en bas à droite.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className={`text-base font-semibold mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Comment créer un objectif ?
                            </Text>
                            <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Allez dans l&apos;onglet &quot;Objectifs&quot; et appuyez sur le bouton flottant pour créer un nouvel objectif.
                            </Text>
                        </View>

                        <View className="mb-4">
                            <Text className={`text-base font-semibold mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Comment activer la biométrie ?
                            </Text>
                            <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Allez dans Profil {'>'} Paramètres avancés {'>'} Sécurité, puis activez l&apos;option Biométrie.
                            </Text>
                        </View>
                    </View>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-6`}>
                        <Text className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                            Besoin d&apos;aide supplémentaire ?
                        </Text>
                        <Text className={`text-base mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Envoyez-nous un email à :
                        </Text>
                        <Text className={`text-base font-semibold text-cyan-500`}>
                            support@tantano.com
                        </Text>
                        <Text className={`text-sm mt-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            Nous vous répondrons dans les plus brefs délais.
                        </Text>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}