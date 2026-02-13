import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    StatusBar,
    Alert
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useWalletStore, WalletType } from '@/stores/useWalletStore';
import { useRouter } from 'expo-router';

import { Header } from './walletComponents/Header';
import { StatCards } from './walletComponents/StatCards';
import { FilterBar } from './walletComponents/FilterBar';
import { CreateForm } from './walletComponents/CreateForm';
import { WalletList } from './walletComponents/WalletList';

export default function WalletsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();


    const {
        wallets,
        isLoading,
        isCreating,
        isUpdating,
        isUpdatingIncome,
        fetchWallets,
        createWallet,
        toggleWalletActive,
        updateAutomaticIncome,
        toggleWalletDetails,
        getTotalBalance,
        getActiveCount,
        getInactiveCount
    } = useWalletStore();

    // États locaux
    const [refreshing, setRefreshing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showIncomeForm, setShowIncomeForm] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<'ALL' | WalletType>('ALL');
    const [showInactive, setShowInactive] = useState(false);


    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    useEffect(() => {
        if (user?.id) {
            fetchWallets(user.id);
        }
    }, [user?.id]);


    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) await fetchWallets(user.id);
        setRefreshing(false);
    };

    const handleCreateWallet = async (name: string, description: string, type: WalletType) => {
        if (!user?.id) return;
        const created = await createWallet(user.id, { name, description, type });
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
        if (!showInactive && !wallet.isActive) return false;
        return true;
    });


    const totalBalance = getTotalBalance();
    const activeCount = getActiveCount();
    const inactiveCount = getInactiveCount();

    return (
        <ScrollView
        className="flex-1 bg-white dark:bg-black"
        refreshControl={
            <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme === 'dark' ? '#06b6d4' : '#0891b2'}
            />
        }
        >

        <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'}
        rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
        <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'}
        rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

        <View className="px-4 pt-8">

        <Header
        showCreateForm={showAddForm}
        onToggleForm={() => {
            setShowAddForm(!showAddForm);
            setShowIncomeForm(null);
        }}
        />


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
            onCreate={handleCreateWallet}
            isCreating={isCreating}
            onCancel={() => setShowAddForm(false)}
            getWalletTypeStyle={getWalletTypeStyle}
            />
        )}


        <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-20`}>
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
        getWalletTypeStyle={getWalletTypeStyle}
        />
        </View>


        <View className="items-center mb-8">
        <Text className={`${theme === 'dark' ? 'text-cyan-400/50' : 'text-cyan-500'} text-center`}>
        © {new Date().getFullYear()} Tantano - CodeV
        </Text>
        </View>
        </View>
        </ScrollView>
    );
}
