import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as LocalAuthentication from 'expo-local-authentication';
import { User } from '@/types/api';
import { authAPI } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateToken: (token: string) => Promise<void>;
    loginWithBiometrics: () => Promise<boolean>;
    biometricsAvailable: boolean;
    forgotPassword: (email: string) => Promise<void>;
    googleSignIn: (idToken: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [biometricsAvailable, setBiometricsAvailable] = useState(false);

    useEffect(() => {
        checkBiometrics();
        loadUser();
    }, []);

    const checkBiometrics = async () => {
        const compatible = await LocalAuthentication.hasHardwareAsync();
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setBiometricsAvailable(compatible && enrolled);
    };

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedToken = await AsyncStorage.getItem('token');

            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to load user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            console.log('Tentative de connexion...');
            const response = await authAPI.login({ email, password });
            const { account, token } = response.data;

            await AsyncStorage.setItem('user', JSON.stringify(account));
            await AsyncStorage.setItem('token', token);

            setUser(account);
            console.log('Connexion réussie');

            try {
                await SecureStore.setItemAsync('credentials', JSON.stringify({ email, password }));
            } catch (e) {
                console.error('Failed to save credentials for biometrics', e);
            }
        } catch (error: any) {
            console.error('Login failed:', error);

            let errorMessage = 'Échec de connexion';
            if (error.message && error.message.includes('Le serveur met trop de temps')) {
                errorMessage = 'Le serveur met trop de temps à répondre. Réessayez dans quelques secondes (service gratuit en démarrage).';
            } else if (error.response?.status === 401) {
                errorMessage = 'Nom d\'utilisateur ou mot de passe incorrect';
            }

            const enhancedError = new Error(errorMessage);
            enhancedError.cause = error;
            throw enhancedError;
        }
    };

    const register = async (email: string, password: string) => {
        try {
            console.log('Tentative d\'inscription...');

            await authAPI.register({ email, password });

            console.log('Inscription réussie, connexion automatique...');

            const loginResponse = await authAPI.login({ email, password });
            const { account, token } = loginResponse.data;

            await AsyncStorage.setItem('user', JSON.stringify(account));
            await AsyncStorage.setItem('token', token);

            setUser(account);
            console.log('Inscription et connexion réussies');

            try {
                await SecureStore.setItemAsync('credentials', JSON.stringify({ email, password }));
            } catch (e) {
                console.error('Failed to save credentials for biometrics', e);
            }
        } catch (error: any) {
            console.error('Registration failed:', error);

            let errorMessage = 'Échec de l\'inscription';
            if (error.message && error.message.includes('Le serveur met trop de temps')) {
                errorMessage = 'Le serveur met trop de temps à répondre. Le service gratuit peut prendre jusqu\'à 30 secondes pour démarrer. Réessayez dans quelques instants.';
            } else if (error.response?.status === 409) {
                errorMessage = 'Ce nom d\'utilisateur est déjà pris';
            }

            const enhancedError = new Error(errorMessage);
            enhancedError.cause = error;
            throw enhancedError;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const updateToken = async (token: string) => {
        try {
            await AsyncStorage.setItem('token', token);
        } catch (error) {
            console.error('Failed to update token:', error);
        }
    };

    const loginWithBiometrics = async (): Promise<boolean> => {
        try {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Authentifiez-vous pour vous connecter',
                cancelLabel: 'Annuler',
            });
            if (result.success) {
                const creds = await SecureStore.getItemAsync('credentials');
                if (creds) {
                    const { username, password } = JSON.parse(creds);
                    await login(username, password);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Biometric login failed:', error);
            return false;
        }
    };

    const forgotPassword = async (email: string) => {
        /*try {
            await authAPI.forgotPassword({ email });
        } catch (error) {
            console.error('Forgot password failed:', error);
            throw new Error('Impossible d\'envoyer l\'email de réinitialisation');
        }*/
    };

    const googleSignIn = async (idToken: string) => {
        try {
            // On simule une réponse
            const response = await fetch(`${process.env.API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idToken }),
            });
            const data = await response.json();
            if (response.ok) {
                const { account, token } = data;
                await AsyncStorage.setItem('user', JSON.stringify(account));
                await AsyncStorage.setItem('token', token);
                setUser(account);
            } else {
                throw new Error(data.message || 'Erreur Google Sign-In');
            }
        } catch (error) {
            console.error('Google sign-in failed:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
                updateToken,
                loginWithBiometrics,
                biometricsAvailable,
                forgotPassword,
                googleSignIn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};