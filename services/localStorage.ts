import AsyncStorage from '@react-native-async-storage/async-storage';

const WALLET_COLORS_KEY = '@wallet_colors';
const WALLET_ICONS_KEY = '@wallet_icons';

export const localStorageService = {
    saveWalletColor: async (walletId: string, color: string) => {
        try {
            const existing = await AsyncStorage.getItem(WALLET_COLORS_KEY);
            const colors = existing ? JSON.parse(existing) : {};
            colors[walletId] = color;
            await AsyncStorage.setItem(WALLET_COLORS_KEY, JSON.stringify(colors));
            console.log(' Couleur sauvegardée:', { walletId, color });
        } catch (error) {
            console.error('Erreur sauvegarde couleur:', error);
        }
    },

    saveWalletIcon: async (walletId: string, icon: string | null) => {
        try {
            const existing = await AsyncStorage.getItem(WALLET_ICONS_KEY);
            const icons = existing ? JSON.parse(existing) : {};
            if (icon) {
                icons[walletId] = icon;
            } else {
                delete icons[walletId];
            }
            await AsyncStorage.setItem(WALLET_ICONS_KEY, JSON.stringify(icons));
            console.log(' Icône sauvegardée:', { walletId, icon });
        } catch (error) {
            console.error(' Erreur sauvegarde icône:', error);
        }
    },

    getAllWalletColors: async (): Promise<Record<string, string>> => {
        try {
            const data = await AsyncStorage.getItem(WALLET_COLORS_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error(' Erreur récupération couleurs:', error);
            return {};
        }
    },

    getAllWalletIcons: async (): Promise<Record<string, string>> => {
        try {
            const data = await AsyncStorage.getItem(WALLET_ICONS_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error(' Erreur récupération icônes:', error);
            return {};
        }
    },

    getWalletColor: async (walletId: string): Promise<string | null> => {
        const colors = await localStorageService.getAllWalletColors();
        return colors[walletId] || null;
    },

    getWalletIcon: async (walletId: string): Promise<string | null> => {
        const icons = await localStorageService.getAllWalletIcons();
        return icons[walletId] || null;
    },

    clearAllWalletData: async () => {
        await AsyncStorage.removeItem(WALLET_COLORS_KEY);
        await AsyncStorage.removeItem(WALLET_ICONS_KEY);
        console.log(' Données locales nettoyées');
    }
};