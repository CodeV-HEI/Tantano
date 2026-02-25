import { walletAPI } from '@/services/api';
import { WalletType } from '@/types/api';
import { PaginationInfo, Wallet, WALLET_COLOR_PALETTE, WalletWithUI } from '@/types/wallet';
import { Alert } from 'react-native';
import { create } from 'zustand';

interface WalletStore {
    wallets: WalletWithUI[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    isCreating: boolean;
    isUpdating: Record<string, boolean>;
    isUpdatingIncome: Record<string, boolean>;
    error: string | null;
    currentFilters: {
        name?: string;
        isActive?: boolean;
        type?: WalletType;
    };
    currentPage: number;

    fetchWallets: (accountId: string, page?: number, filters?: {
        name?: string;
        isActive?: boolean;
        type?: WalletType;
    }) => Promise<void>;
    loadMoreWallets: (accountId: string) => Promise<void>;
    createWallet: (accountId: string, walletData: {
        name: string;
        description?: string;
        type: WalletType;
        color?: string;
        iconRef?: string;
    }) => Promise<Wallet | null>;
    updateWallet: (accountId: string, id: string, walletData: Partial<Wallet>) => Promise<Wallet | null>;
    toggleWalletActive: (accountId: string, id: string, isActive: boolean) => Promise<Wallet | null>;
    archiveWallet: (accountId: string, id: string, name: string) => Promise<void>;
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
    getWalletById: (id: string) => WalletWithUI | undefined;
    getTotalBalance: () => number;
    getActiveCount: () => number;
    getInactiveCount: () => number;
    getWalletsByType: (type: WalletType) => WalletWithUI[];
    clearError: () => void;
    reset: () => void;
}

export const useWalletStore = create<WalletStore>((set, get) => ({
    wallets: [],
    pagination: null,
    isLoading: false,
    isLoadingMore: false,
    isCreating: false,
    isUpdating: {},
    isUpdatingIncome: {},
    error: null,
    currentFilters: {},
    currentPage: 1,

    fetchWallets: async (accountId, page = 1, filters = {}) => {
    if (!accountId) return;

    set(state => ({
        isLoading: page === 1,
        isLoadingMore: page > 1,
        currentFilters: page === 1 ? filters : state.currentFilters,
        currentPage: page,
        error: null
    }));

    try {
        console.log(' Appel API avec filtres:', {
            accountId,
            page,
            ...filters
        });

        const response = await walletAPI.getAll(accountId, {
            name: filters.name,
            isActive: filters.isActive,
            walletType: filters.type
        });

        const newWallets = response.data.values || [];
        const pagination = response.data.pagination;

        const walletsWithColor = newWallets.map((w: any) => ({
            ...w,
            color: w.color || WALLET_COLOR_PALETTE[Math.floor(Math.random() * WALLET_COLOR_PALETTE.length)]
        }));

        console.log(` Page ${page}: ${newWallets.length} wallets reçus`);
        console.log('Couleurs attribuées:', walletsWithColor.map((w: any) => ({
            name: w.name,
            color: w.color
        })));

        set(state => ({
            wallets: page === 1 ? walletsWithColor : [...state.wallets, ...walletsWithColor],
            pagination,
            isLoading: false,
            isLoadingMore: false
        }));

    } catch (error: any) {
        console.error('Erreur fetchWallets:', error);
        set({
            isLoading: false,
            isLoadingMore: false,
            error: 'Erreur de chargement'
        });
    }
},

    loadMoreWallets: async (accountId: string) => {
        const { pagination, isLoadingMore, currentFilters, currentPage } = get();
        if (!pagination?.hasNext || isLoadingMore) return;

        const nextPage = currentPage + 1;
        await get().fetchWallets(accountId, nextPage, currentFilters);
    },

    createWallet: async (accountId, walletData) => {
        if (!accountId) return null;
        if (!walletData.name.trim()) {
            Alert.alert('Erreur', 'Le nom du wallet est requis');
            return null;
        }

        set({ isCreating: true, error: null });

        try {
            const walletColor = walletData.color ||
                WALLET_COLOR_PALETTE[Math.floor(Math.random() * WALLET_COLOR_PALETTE.length)];

            console.log(' Création wallet:', { ...walletData, color: walletColor });

            const response = await walletAPI.create(accountId, {
                name: walletData.name.trim(),
                description: walletData.description?.trim() || undefined,
                type: walletData.type,
                color: walletColor,
                iconRef: walletData.iconRef || undefined
            });

            console.log(' Wallet créé:', response.data);

            await get().fetchWallets(accountId, 1, get().currentFilters);

            Alert.alert('Succès', 'Wallet créé avec succès');
            set({ isCreating: false });
            return response.data;
        } catch (error: any) {
            console.error(' Erreur createWallet:', error?.response?.data || error);
            set({ isCreating: false, error: 'Erreur de création' });
            Alert.alert('Erreur', error?.response?.data?.message || 'Impossible de créer le wallet');
            return null;
        }
    },

    updateWallet: async (accountId, id, walletData) => {
        if (!accountId || !id) return null;

        set(state => ({
            isUpdating: { ...state.isUpdating, [id]: true },
            error: null
        }));

        try {
            const existingWallet = get().wallets.find(w => w.id === id);
            if (!existingWallet) throw new Error('Wallet non trouvé');

            console.log(' Mise à jour wallet:', { id, ...walletData });

            const response = await walletAPI.update(accountId, id, {
                id,
                accountId,
                name: walletData.name ?? existingWallet.name,
                description: walletData.description ?? existingWallet.description,
                type: walletData.type ?? existingWallet.type,
                color: walletData.color ?? existingWallet.color,
                iconRef: walletData.iconRef ?? existingWallet.iconRef,
                isActive: walletData.isActive ?? existingWallet.isActive
            });

            console.log(' Wallet modifié:', response.data);

            set(state => {
                const index = state.wallets.findIndex(w => w.id === id);
                const newWallets = [...state.wallets];
                if (index !== -1) {
                    newWallets[index] = {
                        ...response.data,
                        _showDetails: state.wallets[index]._showDetails
                    };
                }
                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];

                return {
                    wallets: newWallets,
                    isUpdating: newIsUpdating
                };
            });

            Alert.alert('Succès', 'Wallet modifié avec succès');
            return response.data;
        } catch (error: any) {
            console.error(' Erreur updateWallet:', error?.response?.data || error);
            set(state => {
                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];
                return {
                    isUpdating: newIsUpdating,
                    error: 'Erreur de modification'
                };
            });
            Alert.alert('Erreur', error?.response?.data?.message || 'Impossible de modifier le wallet');
            return null;
        }
    },

    toggleWalletActive: async (accountId, id, isActive) => {
        return get().updateWallet(accountId, id, { isActive: !isActive });
    },

    archiveWallet: async (accountId: string, id: string, name: string) => {
        Alert.alert(
            'Archiver le wallet',
            `Archiver "${name}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Archiver',
                    style: 'destructive',
                    onPress: async () => {
                        set(state => ({
                            wallets: state.wallets.map(w =>
                                w.id === id ? { ...w, _isArchiving: true } : w
                            )
                        }));

                        try {
                            await walletAPI.archive(accountId, id);
                            set(state => ({
                                wallets: state.wallets.filter(w => w.id !== id)
                            }));
                            Alert.alert('Succès', 'Wallet archivé');
                        } catch (error: any) {
                            console.error('Erreur archive:', error);
                            set(state => ({
                                wallets: state.wallets.map(w =>
                                    w.id === id ? { ...w, _isArchiving: false } : w
                                )
                            }));
                            Alert.alert('Erreur', error?.response?.data?.message || "Impossible d'archiver");
                        }
                    }
                }
            ]
        );
    },


updateAutomaticIncome: async (accountId, walletId, incomeData) => {
    if (!accountId || !walletId) return null;
    if (!incomeData.amount || incomeData.amount <= 0) {
        Alert.alert('Erreur', 'Montant invalide');
        return null;
    }

    set(state => ({
        isUpdatingIncome: { ...state.isUpdatingIncome, [walletId]: true },
        error: null
    }));

    try {
        console.log('Configuration revenu auto:', incomeData);

        const response = await walletAPI.updateAutomaticIncome(accountId, walletId, incomeData);
        
        
        const existingWallet = get().wallets.find(w => w.id === walletId);
        
        
        const updatedWallet = {
            ...existingWallet,
            ...response.data,
            color: response.data.color || existingWallet?.color, // Garde l'ancienne couleur si API ne la renvoie pas
            _showDetails: existingWallet?._showDetails
        };

        console.log(' Revenu auto configuré:', updatedWallet);

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

        Alert.alert('Succès', 'Revenu automatique configuré');
        return updatedWallet;
        
    } catch (error: any) {
        console.error(' Erreur updateAutomaticIncome:', error?.response?.data || error);
        set(state => {
            const newIsUpdatingIncome = { ...state.isUpdatingIncome };
            delete newIsUpdatingIncome[walletId];
            return {
                isUpdatingIncome: newIsUpdatingIncome,
                error: 'Erreur de configuration Premium'
            };
        });
        Alert.alert('Erreur', error?.response?.data?.message || 'Fonctionnalité Premium requise');
        return null;
    }
},

    toggleWalletDetails: (id: string) => {
        set(state => {
            const index = state.wallets.findIndex(w => w.id === id);
            if (index === -1) return state;

            const newWallets = [...state.wallets];
            newWallets[index] = {
                ...newWallets[index],
                _showDetails: !newWallets[index]._showDetails
            };

            return { wallets: newWallets };
        });
    },

    getWalletById: (id: string) => {
        return get().wallets.find(w => w.id === id);
    },

    getTotalBalance: () => {
        const total = get().wallets.reduce((sum: number, w: Wallet) => sum + (w.amount || 0), 0);
        return total;
    },

    getActiveCount: () => {
        const active = get().wallets.filter((w: Wallet) => w.isActive).length;
        return active;
    },

    getInactiveCount: () => {
        return get().wallets.filter((w: Wallet) => !w.isActive).length;
    },

    getWalletsByType: (type: WalletType) => {
        return get().wallets.filter((w: Wallet) => w.type === type);
    },

    clearError: () => set({ error: null }),

    reset: () => set({
        wallets: [],
        pagination: null,
        isLoading: false,
        isLoadingMore: false,
        isCreating: false,
        isUpdating: {},
        isUpdatingIncome: {},
        error: null,
        currentFilters: {},
        currentPage: 1
    })
}));