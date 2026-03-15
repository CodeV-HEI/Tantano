import { useTheme } from '@/contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Toast from 'react-native-toast-message';

export default function RateScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const [feedback, setFeedback] = React.useState('');
    const [rating, setRating] = React.useState(0);

    React.useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    const handleSubmit = () => {
        Toast.show({
            type: 'success',
            text1: 'Merci !',
            text2: 'Votre avis nous aide à nous améliorer.',
            position: 'top',
            visibilityTime: 3000,
        });
        router.back();
    };

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
                        Évaluer l&apos;application
                    </Text>

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-6 mb-6`}>
                        <Text className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                            Notez votre expérience
                        </Text>

                        <View className="flex-row justify-center mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                    <MaterialIcons
                                        name={star <= rating ? 'star' : 'star-border'}
                                        size={36}
                                        color={star <= rating ? '#fbbf24' : (theme === 'dark' ? '#6b7280' : '#9ca3af')}
                                        style={{ marginHorizontal: 4 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text className={`text-base font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            Votre avis (facultatif)
                        </Text>
                        <TextInput
                            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} p-4 rounded-xl text-base`}
                            placeholder="Partagez votre expérience..."
                            placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                            multiline
                            numberOfLines={4}
                            value={feedback}
                            onChangeText={setFeedback}
                        />

                        <TouchableOpacity
                            onPress={handleSubmit}
                            className="mt-6 bg-cyan-500 py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-bold text-lg">Envoyer</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        Votre retour nous est précieux pour améliorer Tantano.
                    </Text>
                </Animated.View>
            </ScrollView>
        </View>
    );
}