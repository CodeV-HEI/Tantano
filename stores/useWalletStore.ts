import { walletAPI } from '@/services/api';
import { WalletType } from '@/types/api';
import { PaginationInfo, Wallet, WALLET_COLOR_PALETTE, WalletWithUI } from '@/types/wallet';
import { localStorageService } from '@/services/localStorage';
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

    archiveModalVisible: boolean;
    archiveModalData: { id: string; name: string } | null;
    archiveAccountId: string | null;
    showArchiveModal: (id: string, name: string) => void;
    hideArchiveModal: () => void;
    confirmArchive: () => Promise<void>;

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
    removeDuplicates: () => void;
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

    archiveModalVisible: false,
    archiveModalData: null,
    archiveAccountId: null,

    fetchWallets: async (accountId, page = 1, filters = {}) => {
        if (!accountId) return;

        const state = get();
        if (page === 1 &&
            JSON.stringify(state.currentFilters) === JSON.stringify(filters) &&
            state.wallets.length > 0) {
            console.log(' Filtres identiques, pas de rechargement');
            return;
        }

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

            const localColors = await localStorageService.getAllWalletColors();
            const localIcons = await localStorageService.getAllWalletIcons();

            const existingIds = new Set(state.wallets.map(w => w.id));

            const walletsWithLocalData = newWallets
                .filter((w: any) => !existingIds.has(w.id))
                .map((w: any) => {
                    const localColor = localColors[w.id];
                    const localIcon = localIcons[w.id];

                    return {
                        ...w,
                        color: localColor || w.color || WALLET_COLOR_PALETTE[Math.floor(Math.random() * WALLET_COLOR_PALETTE.length)],
                        iconRef: localIcon || w.iconRef || null,
                        _showDetails: false
                    };
                });

            console.log(`Page ${page}: ${newWallets.length} reçus, ${walletsWithLocalData.length} nouveaux`);

            set(state => ({
                wallets: page === 1 ? walletsWithLocalData : [...state.wallets, ...walletsWithLocalData],
                pagination,
                isLoading: false,
                isLoadingMore: false
            }));

        } catch (error: any) {
            console.error(' Erreur fetchWallets:', error);
            set({
                isLoading: false,
                isLoadingMore: false,
                error: 'Erreur de chargement'
            });
        }
    },

    loadMoreWallets: async (accountId: string) => {
        const { pagination, isLoadingMore, currentFilters, currentPage } = get();

        if (!pagination?.hasNext || isLoadingMore) {
            console.log(' Plus de pages ou déjà en chargement');
            return;
        }

        const expectedNextPage = currentPage + 1;
        if (expectedNextPage > pagination.totalPage) {
            console.log(' Dernière page atteinte');
            return;
        }

        console.log(` Chargement page ${expectedNextPage}...`);
        set({ isLoadingMore: true });

        await get().fetchWallets(accountId, expectedNextPage, currentFilters);
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

            console.log(' Création wallet:', {
                ...walletData,
                color: walletColor,
                description: walletData.description || ''
            });

            const response = await walletAPI.create(accountId, {
                name: walletData.name.trim(),
                description: walletData.description || '',
                type: walletData.type,
                color: walletColor,
                iconRef: walletData.iconRef || undefined
            });

            console.log('Wallet créé (API):', response.data);

            const createdWallet = {
                ...response.data,
                color: walletColor,
                iconRef: walletData.iconRef || null,
                _showDetails: false
            };

            await localStorageService.saveWalletColor(createdWallet.id, walletColor);
            if (walletData.iconRef) {
                await localStorageService.saveWalletIcon(createdWallet.id, walletData.iconRef);
            }

            console.log(' Wallet créé (avec valeurs locales):', createdWallet);

            set(state => ({
                wallets: [createdWallet, ...state.wallets],
                isCreating: false
            }));

            Alert.alert('Succès', 'Wallet créé avec succès');
            return createdWallet;

        } catch (error: any) {
            console.error('Erreur createWallet:', error?.response?.data || error);
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
                description: walletData.description ?? existingWallet.description ?? '',
                type: walletData.type ?? existingWallet.type,
                color: walletData.color ?? existingWallet.color,
                iconRef: walletData.iconRef ?? existingWallet.iconRef,
                isActive: walletData.isActive ?? existingWallet.isActive
            });

            console.log(' Wallet modifié (API):', response.data);

            if (walletData.color) {
                await localStorageService.saveWalletColor(id, walletData.color);
            }
            if (walletData.iconRef !== undefined) {
                await localStorageService.saveWalletIcon(id, walletData.iconRef);
            }

            const localColor = await localStorageService.getWalletColor(id);
            const localIcon = await localStorageService.getWalletIcon(id);

            const updatedWallet = {
                ...response.data,
                color: localColor || response.data.color || existingWallet.color,
                iconRef: localIcon || response.data.iconRef || existingWallet.iconRef,
                _showDetails: existingWallet._showDetails
            };

            console.log(' Wallet modifié (avec valeurs locales):', updatedWallet);

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

            Alert.alert('Succès', 'Wallet modifié avec succès');
            return updatedWallet;
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
        console.log(' Demande d\'archive:', { accountId, id, name });
        set({
            archiveAccountId: accountId,
            archiveModalData: { id, name }
        });
        get().showArchiveModal(id, name);
    },
    showArchiveModal: (id: string, name: string) => {
        console.log(' Affichage du modal archive pour:', name);
        set({
            archiveModalVisible: true,
            archiveModalData: { id, name }
        });
    },

    hideArchiveModal: () => {
        set({ archiveModalVisible: false, archiveModalData: null, archiveAccountId: null });
    },

    confirmArchive: async () => {
        const { archiveModalData, archiveAccountId } = get();
        if (!archiveModalData || !archiveAccountId) return;

        const { id, name } = archiveModalData;

        console.log('Confirmation archive pour:', name);
        set({ archiveModalVisible: false });

        set(state => ({
            wallets: state.wallets.map(w =>
                w.id === id ? { ...w, _isArchiving: true } : w
            )
        }));

        try {
            console.log(' Appel API archive...');
            const response = await walletAPI.archive(archiveAccountId, id);
            console.log(' Réponse API archive:', response.data);

            set(state => ({
                wallets: state.wallets.filter(w => w.id !== id)
            }));

            Alert.alert('Succès', 'Wallet archivé');
        } catch (error: any) {
            console.error(' Erreur archive:', error?.response?.data || error);

            set(state => ({
                wallets: state.wallets.map(w =>
                    w.id === id ? { ...w, _isArchiving: false } : w
                )
            }));

            Alert.alert('Erreur', error?.response?.data?.message || "Impossible d'archiver");
        } finally {
            set({ archiveAccountId: null });
        }
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
            console.log(' Configuration revenu auto:', incomeData);

            const response = await walletAPI.updateAutomaticIncome(accountId, walletId, incomeData);

            const existingWallet = get().wallets.find(w => w.id === walletId);

            const updatedWallet = {
                ...existingWallet,
                ...response.data,
                color: response.data.color || existingWallet?.color,
                iconRef: response.data.iconRef || existingWallet?.iconRef,
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

    removeDuplicates: () => {
        const uniqueWallets = Array.from(
            new Map(get().wallets.map(w => [w.id, w])).values()
        );
        console.log(' Nettoyage:', {
            avant: get().wallets.length,
            après: uniqueWallets.length
        });
        set({ wallets: uniqueWallets });
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
        currentPage: 1,
        archiveModalVisible: false,
        archiveModalData: null,
        archiveAccountId: null
    })
}));