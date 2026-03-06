import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function WalletDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { theme } = useTheme();

    return (
        <View className="flex-1 justify-center items-center">
            <Text className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                Détails du portefeuille : {id}
            </Text>
        </View>
    );
}