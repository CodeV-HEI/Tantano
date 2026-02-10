import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: 'light' | 'dark';
    mode: ThemeMode;
    toggleTheme: () => void;
    setMode: (mode: ThemeMode) => void;
    isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const systemColorScheme = useColorScheme();
    const [mode, setMode] = useState<ThemeMode>('system');
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');

    useEffect(() => {
        loadThemePreference();
    }, []);

    useEffect(() => {
        if (mode === 'system') {
            setTheme(systemColorScheme || 'dark');
        } else {
            setTheme(mode);
        }
    }, [mode, systemColorScheme]);

    const loadThemePreference = async () => {
        try {
            const savedMode = await AsyncStorage.getItem('themeMode');
            if (savedMode) {
                setMode(savedMode as ThemeMode);
            }
        } catch (error) {
            console.error('Failed to load theme preference:', error);
        }
    };

    const saveMode = async (newMode: ThemeMode) => {
        try {
            await AsyncStorage.setItem('themeMode', newMode);
        } catch (error) {
            console.error('Failed to save theme preference:', error);
        }
    };

    const toggleTheme = () => {
        const newMode = mode === 'system'
            ? (theme === 'dark' ? 'light' : 'dark')
            : (mode === 'dark' ? 'light' : 'dark');

        const finalMode = newMode === 'light' ? 'light' : 'dark';
        setMode(finalMode);
        saveMode(finalMode);
    };

    const handleSetMode = (newMode: ThemeMode) => {
        setMode(newMode);
        saveMode(newMode);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            mode,
            toggleTheme,
            setMode: handleSetMode,
            isDarkMode: theme === 'dark'
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};