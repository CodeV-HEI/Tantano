import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface GoogleButtonProps {
    mode: 'login' | 'register';
}

export default function GoogleButton({ mode }: GoogleButtonProps) {
    const { request, promptAsync } = useGoogleAuth();
    const { googleSignIn } = useAuth();
    const { theme } = useTheme();
    const [loading, setLoading] = React.useState(false);

    const handlePress = async () => {
        setLoading(true);
        try {
            const result = await promptAsync();
            if (result?.type === 'success') {
                const { id_token } = result.params;
                await googleSignIn(id_token);
            }
        } catch (error) {
            console.error('Google auth error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableOpacity
            disabled={!request || loading}
            onPress={handlePress}
            className={`flex-row justify-center items-center py-4 px-6 rounded-xl border-2 ${theme === 'dark' ? 'border-cyan-500/60 bg-black' : 'border-cyan-400/50 bg-white'} mb-3`}
        >
            {loading ? (
                <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            ) : (
                <>
                    <FontAwesome name="google" size={24} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                    <Text className={`ml-3 font-bold ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                        {mode === 'login' ? 'Continuer avec Google' : 'S\'inscrire avec Google'}
                    </Text>
                </>
            )}
        </TouchableOpacity>
    );
}