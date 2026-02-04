import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserWithToken } from '@/types/api';
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
            const response = await authAPI.login({ username, password });
            const { account, token } = response.data;

            await AsyncStorage.setItem('user', JSON.stringify(account));
            await AsyncStorage.setItem('token', token);

            setUser(account);
        } catch (error: any) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (username: string, password: string) => {
        try {
            // Appel à l'API d'inscription
            const registerResponse = await authAPI.register({ username, password });
            const newUser = registerResponse.data;

            // Connexion automatique après inscription
            const loginResponse = await authAPI.login({ username, password });
            const { account, token } = loginResponse.data;

            await AsyncStorage.setItem('user', JSON.stringify(account));
            await AsyncStorage.setItem('token', token);

            setUser(account);
        } catch (error: any) {
            console.error('Registration failed:', error);
            throw error;
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