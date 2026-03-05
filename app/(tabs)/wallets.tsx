import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useWalletStore } from '@/stores/useWalletStore';
import { WalletType } from '@/types/api';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import { CreateForm } from './walletComponents/CreateForm';
import { FilterBar } from './walletComponents/FilterBar';
import { Header } from './walletComponents/Header';
import { SearchBar } from './walletComponents/SearchBar';
import { StatCards } from './walletComponents/StatCards';
import { WalletList } from './walletComponents/WalletList';
import { ConfirmationModal } from './walletComponents/ConfirmationModal';

export default function WalletsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();

    const {
        wallets,
        pagination,
        isLoading,
        isLoadingMore,
        isCreating,
        isUpdating,
        isUpdatingIncome,
        fetchWallets,
        loadMoreWallets,
        createWallet,
        toggleWalletActive,
        updateAutomaticIncome,
        toggleWalletDetails,
        archiveWallet,
        getTotalBalance,
        getActiveCount,
        getInactiveCount,
        archiveModalVisible,
        archiveModalData,
        hideArchiveModal,
        confirmArchive
    } = useWalletStore();

    const [refreshing, setRefreshing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showIncomeForm, setShowIncomeForm] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'ALL' | WalletType>('ALL');
    const [showInactive, setShowInactive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const lastFilters = useRef({
        name: '',
        type: 'ALL',
        isActive: true
    });

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    useEffect(() => {
        if (user?.id) {
            console.log(' Chargement initial des wallets');
            fetchWallets(user.id, 1);
        }
    }, [user?.id]);


    useEffect(() => {
        const isActiveValue = !showInactive ? true : false;

        const filtersChanged =
            lastFilters.current.name !== searchQuery ||
            lastFilters.current.type !== filterType ||
            lastFilters.current.isActive !== isActiveValue;

        if (!filtersChanged) return;

        const searchTimeout = setTimeout(() => {
            if (user?.id) {
                console.log('🔍 Appel API avec filtres:', {
                    name: searchQuery || undefined,
                    type: filterType !== 'ALL' ? filterType : undefined,
                    isActive: isActiveValue
                });

                lastFilters.current = {
                    name: searchQuery,
                    type: filterType,
                    isActive: isActiveValue
                };

                fetchWallets(user.id, 1, {
                    name: searchQuery || undefined,
                    type: filterType !== 'ALL' ? filterType : undefined,
                    isActive: isActiveValue
                });
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery, filterType, showInactive, user?.id]);

    useEffect(() => {
        if (wallets.length > 0) {
            const timer = setTimeout(() => {
                useWalletStore.getState().removeDuplicates();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [filterType, showInactive]); 

    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) {
            const isActiveValue = !showInactive ? true : false;
            await fetchWallets(user.id, 1, {
                name: searchQuery || undefined,
                type: filterType !== 'ALL' ? filterType : undefined,
                isActive: isActiveValue
            });
        }
        setRefreshing(false);
    };


    const handleCreateWallet = async (name: string, description: string, type: WalletType, color: string, iconRef?: string) => {
        if (!user?.id) return;
        console.log(' Création wallet avec icône:', { name, description, type, color, iconRef });

        const created = await createWallet(user.id, { name, description, type, color, iconRef });
        if (created) {
            setShowAddForm(false);
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        if (!user?.id) return;
        await toggleWalletActive(user.id, id, isActive);
    };

    const handleUpdateIncome = async (walletId: string, amount: number, day: number) => {
        if (!user?.id) return;
        await updateAutomaticIncome(user.id, walletId, {
            type: 'MENSUAL',
            amount,
            paymentDay: day
        });
        setShowIncomeForm(null);
    };

    const handleToggleIncomeForm = (id: string | null) => {
        setShowIncomeForm(id);
    };

    const handleArchiveWallet = (id: string, name: string) => {
        if (!user?.id) return;
        archiveWallet(user.id, id, name);
    };

    const handleLoadMore = () => {
        if (user?.id && pagination?.hasNext && !isLoadingMore && !searchQuery) {
            console.log(' Chargement de plus de wallets...');
            loadMoreWallets(user.id);
        }
    };

    const handleScroll = ({ nativeEvent }: any) => {
        const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: any) => {
            const paddingToBottom = 100;
            return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
        };

        if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
        }
    };

    const getWalletTypeStyle = (type: WalletType) => {
        switch (type) {
            case 'CASH':
                return {
                    bg: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
                    text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
                    border: theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-300',
                    icon: 'money' as const
                };
            case 'MOBILE_MONEY':
                return {
                    bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
                    text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
                    border: theme === 'dark' ? 'border-green-500/30' : 'border-green-300',
                    icon: 'phone-android' as const
                };
            case 'BANK':
                return {
                    bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
                    text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
                    border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300',
                    icon: 'account-balance' as const
                };
            case 'DEBT':
                return {
                    bg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
                    text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
                    border: theme === 'dark' ? 'border-red-500/30' : 'border-red-300',
                    icon: 'warning' as const
                };
            default:
                return {
                    bg: theme === 'dark' ? 'bg-gray-500/20' : 'bg-gray-100',
                    text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
                    border: theme === 'dark' ? 'border-gray-500/30' : 'border-gray-300',
                    icon: 'account-balance-wallet' as const
                };
        }
    };

    const filteredWallets = wallets.filter(wallet => {
        if (!wallet || !wallet.id) return false;
        if (filterType !== 'ALL' && wallet.type !== filterType) return false;
        if (showInactive) {
            if (wallet.isActive) return false;
        } else {
            if (!wallet.isActive) return false;
        }
        if (searchQuery && !wallet.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        return true;
    });

    const totalBalance = wallets.reduce((sum, w) => sum + (w.amount || 0), 0);
    const activeCount = wallets.filter(w => w.isActive).length;
    const inactiveCount = wallets.filter(w => !w.isActive).length;

    useEffect(() => {
        console.log(' État actuel:', {
            walletsLength: wallets.length,
            totalBalance,
            activeCount,
            inactiveCount,
            pagination,
            searchQuery,
            filterType,
            showInactive,
            filteredCount: filteredWallets.length
        });
    }, [wallets, totalBalance, activeCount, inactiveCount, pagination, searchQuery, filterType, showInactive]);

    return (
        <View className="flex-1">
            <ScrollView
                className="flex-1 bg-white dark:bg-black"
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                        colors={[theme === 'dark' ? '#06b6d4' : '#0891b2']}
                    />
                }
                onScroll={handleScroll}
                scrollEventThrottle={400}
                showsVerticalScrollIndicator={false}
            >
            <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'}
                rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
            <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'}
                rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

            <View className="px-4 pt-8 pb-8">
                <Header
                    showCreateForm={showAddForm}
                    onToggleForm={() => {
                        setShowAddForm(!showAddForm);
                        setShowIncomeForm(null);
                    }}
                />

                {wallets.length > 0 && (
                    <View className="mb-4">
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Rechercher un portefeuille..."
                        />
                    </View>
                )}

                {wallets.length > 0 && (
                    <StatCards
                        totalBalance={totalBalance}
                        activeCount={activeCount}
                        inactiveCount={inactiveCount}
                    />
                )}

                <FilterBar
                    filterType={filterType}
                    onFilterTypeChange={setFilterType}
                    showInactive={showInactive}
                    onShowInactiveChange={() => setShowInactive(!showInactive)}
                    getWalletTypeStyle={getWalletTypeStyle}
                />

                

                {showAddForm && (
                    <CreateForm
                        visible={showAddForm}
                        onCreate={handleCreateWallet}
                        isCreating={isCreating}
                        onCancel={() => setShowAddForm(false)}
                        getWalletTypeStyle={getWalletTypeStyle}
                    />
                )}

                <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mt-4`}>
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                            MES PORTEFEUILLES
                        </Text>
                        <View className="flex-row items-center">
                            <Text className={`text-sm mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                {filteredWallets.length} / {wallets.length}
                            </Text>
                            {pagination && (
                                <View className={`px-2 py-1 rounded-full ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-400/20'}`}>
                                    <Text className={`text-xs ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                        Page {pagination.page}/{pagination.totalPage}
                                    </Text>
                                </View>
                            )}
                        </View>
                    </View>

                    <WalletList
                        wallets={wallets}
                        filteredWallets={filteredWallets}
                        isLoading={isLoading}
                        isUpdating={isUpdating}
                        isUpdatingIncome={isUpdatingIncome}
                        showIncomeForm={showIncomeForm}
                        filterType={filterType}
                        showInactive={showInactive}
                        onToggleDetails={toggleWalletDetails}
                        onToggleActive={handleToggleActive}
                        onToggleIncomeForm={handleToggleIncomeForm}
                        onUpdateIncome={handleUpdateIncome}
                        onArchiveWallet={handleArchiveWallet}
                        getWalletTypeStyle={getWalletTypeStyle}
                    />

                    {isLoadingMore && (
                        <View className="py-6 items-center">
                            <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                            <Text className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Chargement de plus de portefeuilles...
                            </Text>
                        </View>
                    )}

                    {pagination && !pagination.hasNext && wallets.length > 0 && !searchQuery && (
                        <View className="py-4 items-center">
                            <Text className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                — Tu as vu tous tes portefeuilles —
                            </Text>
                        </View>
                    )}

                    {searchQuery && wallets.length === 0 && !isLoading && (
                        <View className="py-10 items-center">
                            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Aucun portefeuille trouvé pour "{searchQuery}"
                            </Text>
                        </View>
                    )}
                </View>

                <View className="items-center mt-8">
                    <Text className={`${theme === 'dark' ? 'text-cyan-400/50' : 'text-cyan-500'} text-center`}>
                        © {new Date().getFullYear()} Tantano - CodeV
                    </Text>
                </View>
            </View>
            </ScrollView>

            <ConfirmationModal
                        visible={archiveModalVisible}
                        title="Archiver le portefeuille"
                        message={`Voulez-vous vraiment archiver "${archiveModalData?.name}" ?\nCette action est réversible.`}
                        onConfirm={confirmArchive}
                        onCancel={hideArchiveModal}
                        confirmText="Archiver"
                        cancelText="Annuler"
                        confirmColor="red"
                    />
        </View>
    );
}