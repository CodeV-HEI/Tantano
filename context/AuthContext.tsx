import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserWithApiKey } from '@/types/api';
import { authAPI } from '@/services/api';

interface AuthContextType {
    user: UserWithApiKey | null;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateApiKey: (apiKey: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<UserWithApiKey | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            const storedApiKey = await AsyncStorage.getItem('apiKey');

            if (storedUser && storedApiKey) {
                setUser({ ...JSON.parse(storedUser), apiKey: storedApiKey });
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
            const userData = response.data;

            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('apiKey', userData.apiKey);

            setUser(userData);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await authAPI.register({ username, email, password });
            const userData = response.data;

            await AsyncStorage.setItem('user', JSON.stringify(userData));
            await AsyncStorage.setItem('apiKey', userData.apiKey);

            setUser(userData);
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('apiKey');
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const updateApiKey = async (apiKey: string) => {
        try {
            await AsyncStorage.setItem('apiKey', apiKey);
            if (user) {
                const updatedUser = { ...user, apiKey };
                setUser(updatedUser);
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error) {
            console.error('Failed to update API key:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateApiKey }}>
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