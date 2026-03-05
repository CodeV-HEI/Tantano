import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { Wallet } from '@/types/wallet';
import { WalletCard } from './WalletCard';
import { IncomeForm } from './IncomeForm';
import { IncomeDisplay } from './IncomeDisplay';

interface Props {
    wallets: Wallet[];
    filteredWallets: Wallet[];
    isLoading: boolean;
    isUpdating: Record<string, boolean>;
    isUpdatingIncome: Record<string, boolean>;
    showIncomeForm: string | null;
    filterType: 'ALL' | Wallet['type'];
    showInactive: boolean;
    onToggleDetails: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
    onToggleIncomeForm: (id: string | null) => void;
    onUpdateIncome: (walletId: string, amount: number, day: number) => Promise<void>;
    onArchiveWallet?: (id: string, name: string) => void;  // Nouveau !
    getWalletTypeStyle: (type: Wallet['type']) => any;
}

export const WalletList = ({
    wallets,
    filteredWallets,
    isLoading,
    isUpdating,
    isUpdatingIncome,
    showIncomeForm,
    filterType,
    showInactive,
    onToggleDetails,
    onToggleActive,
    onToggleIncomeForm,
    onUpdateIncome,
    onArchiveWallet,
    getWalletTypeStyle
}: Props) => {
    const { theme } = useTheme();

    if (isLoading && wallets.length === 0) {
        return (
            <View className="py-10 items-center">
            <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
            Chargement des portefeuilles...
            </Text>
            </View>
        );
    }

    if (filteredWallets.length === 0) {
        return (
            <View className="py-10 items-center">
            <View className={`w-20 h-20 rounded-full ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/10'} items-center justify-center mb-4`}>
            <MaterialIcons name="account-balance-wallet" size={32} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            </View>
            <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-2`}>
            Aucun portefeuille
            </Text>
            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            {filterType !== 'ALL' || showInactive
                ? 'Aucun résultat avec ces filtres'
        : 'Cliquez sur le bouton + pour créer votre premier portefeuille'}
        </Text>
        </View>
        );
    }

    return (
        <>
        {filteredWallets.map((wallet) => {
            if (!wallet || !wallet.id) return null;

            const style = getWalletTypeStyle(wallet.type);
            const isPremium = wallet.walletAutomaticIncome?.type === 'MENSUAL';
            const isShowingIncomeForm = showIncomeForm === wallet.id;

            return (
                <WalletCard
                key={wallet.id}
                wallet={wallet}
                style={style}
                isUpdating={isUpdating[wallet.id]}
                isUpdatingIncome={isUpdatingIncome[wallet.id]}
                isExpanded={(wallet as any)._showDetails}
                isPremium={isPremium}
                isShowingIncomeForm={isShowingIncomeForm}
                onToggleDetails={() => onToggleDetails(wallet.id)}
                onToggleActive={() => onToggleActive(wallet.id, wallet.isActive)}
                onToggleIncomeForm={() => onToggleIncomeForm(isShowingIncomeForm ? null : wallet.id)}
                onArchive={onArchiveWallet ? () => onArchiveWallet(wallet.id, wallet.name) : undefined}
                >
                {isShowingIncomeForm ? (
                    <IncomeForm
                    onSubmit={async (amount, day) => {
                        await onUpdateIncome(wallet.id, amount, day);
                        onToggleIncomeForm(null);
                    }}
                    onCancel={() => onToggleIncomeForm(null)}
                    isUpdating={isUpdatingIncome[wallet.id]}
                    />
                ) : isPremium && (
                    <IncomeDisplay
                    amount={wallet.walletAutomaticIncome!.amount}
                    paymentDay={wallet.walletAutomaticIncome!.paymentDay}
                    />
                )}
                </WalletCard>
            );
        })}
        </>
    );
};
