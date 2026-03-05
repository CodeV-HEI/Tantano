import { fetchExpenseAmount } from "@/services/expenseCalculator";
import { Recurrence } from "@/types";
import { InstantNotification, scheduleNotificationExpense } from "@/utils/notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { useAuth } from "./AuthContext";
import { useCurrency } from "./CurrencyContext";



interface NotificationContextType {
    enabled: boolean;
    recurrence: Recurrence;
    calculePeriod: number;
    freshAmount: number;
    toggle: () => Promise<void>;
    setRecurrence: (recurrence: Recurrence) => Promise<void>;
    setCalculePeriod: (period: number) => Promise<void>;
    setFreshAmount: () => Promise<void>;
}

const STORAGE_KEYS = {
    enabled: '@app_notifications',
    recurrence: '@app_notification_recurrence',
    period: '@app_notification_calcule_period',
} as const;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [enabled, setEnabled] = useState(false);
    const [recurrence, setRecurrenceState] = useState<Recurrence>("daily");
    const [calculePeriod, setCalculePeriodState] = useState(1);
    const [freshAmount, setFreshAmountState] = useState(0);
    const { formatCurrency } = useCurrency();
    const { user } = useAuth();


    const setFreshAmount = useCallback(async () => {
        if (!user?.id || !enabled) return;
        try {
            const amount = await fetchExpenseAmount(user.id, calculePeriod);
            setFreshAmountState(amount);
        } catch (e) {
            console.error('Failed to refresh amount', e);
        }
    }, [user?.id, calculePeriod, enabled]);

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const [saved, savedRecurrence, savedPeriod] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.enabled),
                    AsyncStorage.getItem(STORAGE_KEYS.recurrence),
                    AsyncStorage.getItem(STORAGE_KEYS.period),
                ]);

                if (saved !== null) setEnabled(JSON.parse(saved));
                if (savedRecurrence !== null) setRecurrenceState(savedRecurrence as Recurrence);
                if (savedPeriod !== null) setCalculePeriodState(parseInt(savedPeriod));
            } catch (e) {
                console.error('Failed to load notification settings', e);
            }
        };
        loadSettings();
    }, []);


    useEffect(() => {
        if (!enabled || freshAmount === 0) return;
        scheduleNotificationExpense(freshAmount, recurrence, calculePeriod, enabled, formatCurrency);
    }, [freshAmount, enabled, recurrence, calculePeriod, formatCurrency]);

    const toggle = async () => {
        try {
            if (Platform.OS === 'web') {
                const newValue = !enabled;
                setEnabled(newValue);
                await AsyncStorage.setItem(STORAGE_KEYS.enabled, JSON.stringify(newValue));
                Toast.show({
                    type: newValue ? 'success' : 'info',
                    text1: newValue ? 'Notifications activées' : 'Notifications désactivées',
                    position: 'top',
                    visibilityTime: 2000,
                });
                return;
            }
            if (!Device.isDevice) {
                alert('Les notifications push nécessitent un appareil physique');
                return;
            }
            if (!enabled) {
                const { status } = await Notifications.requestPermissionsAsync();
                if (status !== 'granted') {
                    alert('Permission refusée pour les notifications');
                    return;
                }
            } else {
                await Notifications.cancelAllScheduledNotificationsAsync();
            }
            const newValue = !enabled;
            if (newValue === true) {
                await InstantNotification(recurrence, calculePeriod);
            }
            setEnabled(newValue);
            await AsyncStorage.setItem(STORAGE_KEYS.enabled, JSON.stringify(newValue));
        } catch (e) {
            console.error('Failed to save notification settings', e);
        }
    };

    const setRecurrence = async (recurrence: Recurrence) => {
        setRecurrenceState(recurrence);
        await AsyncStorage.setItem(STORAGE_KEYS.recurrence, recurrence);
        scheduleNotificationExpense(freshAmount, recurrence, calculePeriod, enabled, formatCurrency);
    };

    const setCalculePeriod = async (period: number) => {
        setCalculePeriodState(period);
        await AsyncStorage.setItem(STORAGE_KEYS.period, period.toString());
        const amount = await fetchExpenseAmount(user!.id, period);
        setFreshAmountState(amount);
        scheduleNotificationExpense(amount, recurrence, period, enabled, formatCurrency);
    };



    return (
        <NotificationContext.Provider value={{
            enabled,
            recurrence,
            calculePeriod,
            freshAmount,
            toggle,
            setRecurrence,
            setCalculePeriod,
            setFreshAmount,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};