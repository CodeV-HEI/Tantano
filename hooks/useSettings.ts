import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type NotificationRecurrence = 'daily' | 'weekly' | 'monthly';
export type Currency = 'USD' | 'MGA' | 'EUR';

export interface Settings {
    notificationRecurrence: NotificationRecurrence;
    notificationDays: number;
    isPremium: boolean;
    currency: Currency;
    biometricsEnabled: boolean;
}

const defaultSettings: Settings = {
    notificationRecurrence: 'daily',
    notificationDays: 1,
    isPremium: false,
    currency: 'MGA',
    biometricsEnabled: false,
};

const SETTINGS_KEY = 'app_settings';

export function useSettings() {
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    const loadSettings = useCallback(async () => {
        try {
            const stored = await AsyncStorage.getItem(SETTINGS_KEY);
            if (stored) {
                setSettings(JSON.parse(stored));
            } else {
                setSettings(defaultSettings);
            }
        } catch (error) {
            console.error('Failed to load settings', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadSettings();
    }, [loadSettings]);

    const updateSettings = async (newSettings: Partial<Settings>) => {
        const updated = { ...settings, ...newSettings };
        setSettings(updated);
        try {
            await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
        } catch (error) {
            console.error('Failed to save settings', error);
        }
    };

    const refreshSettings = async () => {
        setLoading(true);
        await loadSettings();
    };

    return { settings, loading, updateSettings, refreshSettings };
}