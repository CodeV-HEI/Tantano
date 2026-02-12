import { create } from 'zustand';
import { walletAPI } from '@/services/api';
import { Alert } from 'react-native';


export type WalletType = 'CASH' | 'MOBILE_MONEY' | 'BANK' | 'DEBT';

export interface Wallet {
    id: string;
    name: string;
    description?: string;
    type: WalletType;
    amount: number;
    isActive: boolean;
    walletAutomaticIncome?: {
        type: 'NOT_SPECIFIED' | 'MENSUAL';
        amount: number;
        paymentDay: number;
    };
}

interface WalletStore {

    wallets: Wallet[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: Record<string, boolean>;
    isUpdatingIncome: Record<string, boolean>;
    error: string | null;


    fetchWallets: (accountId: string) => Promise<void>;
    createWallet: (accountId: string, walletData: {
        name: string;
        description?: string;
        type: WalletType;
    }) => Promise<Wallet | null>;
    updateWallet: (accountId: string, id: string, walletData: Partial<Wallet>) => Promise<Wallet | null>;
    toggleWalletActive: (accountId: string, id: string, isActive: boolean) => Promise<Wallet | null>;


    updateAutomaticIncome: (
        accountId: string,
        walletId: string,
        incomeData: {
            type: 'NOT_SPECIFIED' | 'MENSUAL';
            amount: number;
            paymentDay: number;
        }
    ) => Promise<Wallet | null>;


    toggleWalletDetails: (id: string) => void;


    getWalletById: (id: string) => Wallet | undefined;
    getTotalBalance: () => number;
    getActiveCount: () => number;
    getInactiveCount: () => number;
    getWalletsByType: (type: WalletType) => Wallet[];
    clearError: () => void;
    reset: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({

    wallets: [],
    isLoading: false,
    isCreating: false,
    isUpdating: {},
    isUpdatingIncome: {},
    error: null,


    fetchWallets: async (accountId: string) => {
        if (!accountId) {
            console.error('fetchWallets: accountId manquant');
            return;
        }

        set({ isLoading: true, error: null });

        try {
            console.log(`📦 Récupération des wallets pour account: ${accountId}`);
            const response = await walletAPI.getAll(accountId);
            let fetchedWallets = response.data.values || [];


            fetchedWallets = fetchedWallets.filter((w: Wallet) => w && w.id && w.name);

            console.log(`${fetchedWallets.length} wallets récupérés`);
            set({
                wallets: fetchedWallets,
                isLoading: false
            });
        } catch (error: any) {
            console.error(' Erreur fetchWallets:', error?.response?.data || error.message);
            set({
                isLoading: false,
                error: 'Impossible de charger les portefeuilles'
            });
            Alert.alert('Erreur', 'Impossible de charger les portefeuilles');
        }
    },


    createWallet: async (accountId, walletData) => {
        if (!accountId) {
            console.error('createWallet: accountId manquant');
            return null;
        }

        if (!walletData.name.trim()) {
            Alert.alert('Erreur', 'Le nom du portefeuille est requis');
            return null;
        }

        set({ isCreating: true, error: null });

        try {
            console.log(` Création du wallet: ${walletData.name}`);
            const response = await walletAPI.create(accountId, {
                name: walletData.name.trim(),
                                                    description: walletData.description?.trim() || undefined,
                                                    type: walletData.type
            });

            const newWallet = response.data;
            console.log(' Wallet créé:', newWallet);

            set(state => ({
                wallets: [newWallet, ...state.wallets],
                isCreating: false
            }));

            Alert.alert('Succès', 'Portefeuille créé avec succès');
            return newWallet;
        } catch (error: any) {
            console.error(' Erreur createWallet:', error?.response?.data || error.message);
            set({
                isCreating: false,
                error: 'Impossible de créer le portefeuille'
            });
            Alert.alert('Erreur', 'Impossible de créer le portefeuille');
            return null;
        }
    },


    updateWallet: async (accountId, id, walletData) => {
        if (!accountId || !id) {
            console.error('updateWallet: accountId ou id manquant');
            return null;
        }

        set(state => ({
            isUpdating: { ...state.isUpdating, [id]: true },
            error: null
        }));

        try {
            console.log(` Mise à jour du wallet: ${id}`);
            const response = await walletAPI.update(accountId, id, {
                id,
                accountId,
                ...walletData
            });

            const updatedWallet = response.data;
            console.log(' Wallet modifié:', updatedWallet);


            set(state => {
                const index = state.wallets.findIndex(w => w.id === id);
                const newWallets = [...state.wallets];
                if (index !== -1) {
                    newWallets[index] = updatedWallet;
                }

                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];

                return {
                    wallets: newWallets,
                    isUpdating: newIsUpdating
                };
            });

            Alert.alert('Succès', 'Portefeuille modifié avec succès');
            return updatedWallet;
        } catch (error: any) {
            console.error(' Erreur updateWallet:', error?.response?.data || error.message);
            set(state => {
                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];
                return {
                    isUpdating: newIsUpdating,
                    error: 'Impossible de modifier le portefeuille'
                };
            });
            Alert.alert('Erreur', 'Impossible de modifier le portefeuille');
            return null;
        }
    },


    toggleWalletActive: async (accountId, id, isActive) => {
        return get().updateWallet(accountId, id, { isActive: !isActive });
    },


    updateAutomaticIncome: async (accountId, walletId, incomeData) => {
        if (!accountId || !walletId) {
            console.error('updateAutomaticIncome: accountId ou walletId manquant');
            return null;
        }

        if (!incomeData.amount || incomeData.amount <= 0) {
            Alert.alert('Erreur', 'Montant invalide');
            return null;
        }

        if (incomeData.paymentDay < 1 || incomeData.paymentDay > 31) {
            Alert.alert('Erreur', 'Le jour doit être entre 1 et 31');
            return null;
        }

        set(state => ({
            isUpdatingIncome: { ...state.isUpdatingIncome, [walletId]: true },
            error: null
        }));

        try {
            console.log(` Configuration revenu auto pour wallet: ${walletId}`);
            const response = await walletAPI.updateAutomaticIncome(accountId, walletId, {
                type: 'MENSUAL',
                amount: incomeData.amount,
                paymentDay: incomeData.paymentDay
            });

            const updatedWallet = response.data;
            console.log(' Revenu automatique configuré:', updatedWallet);


            set(state => {
                const index = state.wallets.findIndex(w => w.id === walletId);
                const newWallets = [...state.wallets];
                if (index !== -1) {
                    newWallets[index] = updatedWallet;
                }

                const newIsUpdatingIncome = { ...state.isUpdatingIncome };
                delete newIsUpdatingIncome[walletId];

                return {
                    wallets: newWallets,
                    isUpdatingIncome: newIsUpdatingIncome
                };
            });

            Alert.alert('Succès', 'Revenu automatique configuré avec succès');
            return updatedWallet;
        } catch (error: any) {
            console.error(' Erreur updateAutomaticIncome:', error?.response?.data || error.message);
            set(state => {
                const newIsUpdatingIncome = { ...state.isUpdatingIncome };
                delete newIsUpdatingIncome[walletId];
                return {
                    isUpdatingIncome: newIsUpdatingIncome,
                    error: 'Fonctionnalité Premium requise'
                };
            });
            Alert.alert('Erreur', 'Fonctionnalité Premium requise');
            return null;
        }
    },


    toggleWalletDetails: (id: string) => {
        set(state => {
            const index = state.wallets.findIndex(w => w.id === id);
            if (index === -1) return state;

            const newWallets = [...state.wallets];
            const wallet = { ...newWallets[index] };


            (wallet as any)._showDetails = !(wallet as any)._showDetails;
            newWallets[index] = wallet;

            return { wallets: newWallets };
        });
    },

    getWalletById: (id: string) => {
        return get().wallets.find(w => w.id === id);
    },


    getTotalBalance: () => {
        return get().wallets.reduce((sum, w) => sum + (w.amount || 0), 0);
    },

    getActiveCount: () => {
        return get().wallets.filter(w => w.isActive).length;
    },

    getInactiveCount: () => {
        return get().wallets.filter(w => !w.isActive).length;
    },


    getWalletsByType: (type: WalletType) => {
        return get().wallets.filter(w => w.type === type);
    },


    clearError: () => set({ error: null }),

                                                                 reset: () => set({
                                                                     wallets: [],
                                                                     isLoading: false,
                                                                     isCreating: false,
                                                                     isUpdating: {},
                                                                     isUpdatingIncome: {},
                                                                     error: null
                                                                 })
}));
