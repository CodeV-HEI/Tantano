import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types/api';
import { authAPI } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateToken: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

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

    const login = async (username: string, password: string) => {
        try {
            console.log('Tentative de connexion...');
            const response = await authAPI.login({ username, password });
            const { account, token } = response.data;

            await AsyncStorage.setItem('user', JSON.stringify(account));
            await AsyncStorage.setItem('token', token);

            setUser(account);
            console.log('Connexion réussie');
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

    const register = async (username: string, password: string) => {
        try {
            console.log('Tentative d\'inscription...');

            await authAPI.register({ username, password });

            console.log('Inscription réussie, connexion automatique...');

            const loginResponse = await authAPI.login({ username, password });
            const { account, token } = loginResponse.data;

            await AsyncStorage.setItem('user', JSON.stringify(account));
            await AsyncStorage.setItem('token', token);

            setUser(account);
            console.log('Inscription et connexion réussies');
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

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateToken }}>
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