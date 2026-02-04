import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
    FadeInUp,
    SlideInRight,
    Layout
} from 'react-native-reanimated';
import { useAuth } from '@/context/AuthContext';
import { walletAPI, transactionAPI, labelAPI } from '@/services/api';
import { Wallet, Transaction, Label, WalletType } from '@/types/api';

export default function DashboardScreen() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [labels, setLabels] = useState<Label[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [totalBalance, setTotalBalance] = useState(0);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        if (!user) return;

        try {
            // Récupérer les portefeuilles
            const walletsRes = await walletAPI.getAll(user.id);
            const walletsData = walletsRes.data.values;
            setWallets(walletsData);

            // Récupérer les labels
            const labelsRes = await labelAPI.getAll(user.id);
            const labelsData = labelsRes.data.values;
            setLabels(labelsData);

            // Récupérer les transactions pour tous les portefeuilles
            let allTransactions: Transaction[] = [];
            for (const wallet of walletsData) {
                try {
                    const transactionsRes = await transactionAPI.getAll(user.id, wallet.id);
                    allTransactions = [...allTransactions, ...transactionsRes.data];
                } catch (error) {
                    console.error(`Failed to fetch transactions for wallet ${wallet.id}:`, error);
                }
            }

            // Trier les transactions par date (plus récentes en premier)
            allTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setTransactions(allTransactions);

            // Calculer le solde total (somme des montants des portefeuilles)
            const balance = walletsData.reduce((acc, wallet) => acc + wallet.amount, 0);
            setTotalBalance(balance);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            Alert.alert('Erreur', 'Impossible de charger les données');
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData();
        setRefreshing(false);
    };

    const QuickAction = ({
        icon,
        title,
        color,
        onPress
    }: {
        icon: keyof typeof MaterialIcons.glyphMap;
        title: string;
        color: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            className="items-center"
            onPress={onPress}
        >
            <View className={`w-16 h-16 rounded-2xl ${color} items-center justify-center mb-2 shadow-lg shadow-cyan-500/50`}>
                <MaterialIcons name={icon} size={28} color="white" />
            </View>
            <Text className="text-sm text-cyan-300 font-medium tracking-wide neon-text">{title}</Text>
        </TouchableOpacity>
    );

    const getWalletTypeColor = (type: WalletType) => {
        switch (type) {
            case WalletType.CASH:
                return { bg: 'bg-yellow-500/20 border border-yellow-500/30', text: 'text-yellow-400' };
            case WalletType.MOBILE_MONEY:
                return { bg: 'bg-green-500/20 border border-green-500/30', text: 'text-green-400' };
            case WalletType.BANK:
                return { bg: 'bg-blue-500/20 border border-blue-500/30', text: 'text-blue-400' };
            case WalletType.DEBT:
                return { bg: 'bg-red-500/20 border border-red-500/30', text: 'text-red-400' };
            default:
                return { bg: 'bg-gray-500/20 border border-gray-500/30', text: 'text-gray-400' };
        }
    };

    if (!user) {
        return (
            <View className="flex-1 bg-black items-center justify-center">
                <Text className="text-white text-lg">Chargement...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            className="flex-1 bg-black"
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#06b6d4"
                    colors={['#06b6d4']}
                />
            }
        >
            <View className="absolute top-10 -left-20 w-80 h-80 bg-purple-500 rounded-full opacity-10 blur-3xl" />
            <View className="absolute bottom-40 -right-20 w-80 h-80 bg-cyan-500 rounded-full opacity-10 blur-3xl" />

            <View className="px-4 pt-8">
                <Animated.View entering={FadeInUp.duration(600)}>
                    <Text className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 neon-text">
                        Bonjour, {user?.username}
                    </Text>
                    <Text className="text-cyan-300/70 mt-1 tracking-wide">
                        Gérez vos finances en toute simplicité
                    </Text>
                </Animated.View>

                <Animated.View
                    entering={FadeInUp.delay(200)}
                    layout={Layout.springify()}
                    className="bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl p-6 mt-6 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                >
                    <Text className="text-cyan-300 text-lg font-medium tracking-wide neon-text">SOLDE TOTAL</Text>
                    <Text className="text-white text-4xl font-bold mt-2 neon-text">
                        {totalBalance.toLocaleString('fr-FR')} Ar
                    </Text>
                    <Text className="text-cyan-300/60 mt-2 tracking-wide">
                        {transactions.length} transactions • {wallets.length} portefeuilles
                    </Text>
                </Animated.View>

                <Animated.View
                    entering={SlideInRight.delay(300)}
                    className="flex-row justify-between mt-8"
                >
                    <QuickAction
                        icon="add"
                        title="TRANSACTION"
                        color="bg-gradient-to-br from-cyan-500 to-cyan-700"
                        onPress={() => router.push('/transactions')}
                    />
                    <QuickAction
                        icon="account-balance-wallet"
                        title="PORTEFEUILLE"
                        color="bg-gradient-to-br from-purple-500 to-purple-700"
                        onPress={() => router.push('/wallets')}
                    />
                    <QuickAction
                        icon="label"
                        title="LABELS"
                        color="bg-gradient-to-br from-pink-500 to-pink-700"
                        onPress={() => router.push('/labels')}
                    />
                    <QuickAction
                        icon="analytics"
                        title="RAPPORT"
                        color="bg-gradient-to-br from-indigo-500 to-indigo-700"
                        onPress={() => Alert.alert('Rapports', 'Les rapports seront disponibles dans une prochaine mise à jour')}
                    />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(400)} className="mt-10">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-cyan-300 tracking-wide neon-text">PORTEFEUILLES</Text>
                        <TouchableOpacity onPress={() => router.push('/wallets')}>
                            <Text className="text-cyan-400 font-medium tracking-wide neon-text">VOIR TOUT</Text>
                        </TouchableOpacity>
                    </View>

                    {wallets.length === 0 ? (
                        <View className="bg-black/50 rounded-xl p-6 border border-cyan-500/20 items-center">
                            <MaterialIcons name="account-balance-wallet" size={40} color="#06b6d4" />
                            <Text className="text-white text-lg mt-2">Aucun portefeuille</Text>
                            <Text className="text-cyan-300/70 text-center mt-1">
                                Créez votre premier portefeuille pour commencer
                            </Text>
                        </View>
                    ) : (
                        wallets.slice(0, 3).map((wallet, index) => {
                            const colors = getWalletTypeColor(wallet.type);
                            return (
                                <Animated.View
                                    key={wallet.id}
                                    entering={FadeInUp.delay(500 + index * 100)}
                                    className="bg-black/50 rounded-xl p-4 mb-3 border border-cyan-500/20 shadow-sm"
                                >
                                    <TouchableOpacity onPress={() => router.push('/wallets')}>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-1">
                                                <Text className="font-semibold text-white text-lg">{wallet.name}</Text>
                                                {wallet.description && (
                                                    <Text className="text-cyan-300/70 text-sm mt-1">{wallet.description}</Text>
                                                )}
                                                <Text className="text-white text-lg font-bold mt-2">
                                                    {wallet.amount.toLocaleString('fr-FR')} Ar
                                                </Text>
                                            </View>
                                            <View className={`px-3 py-1 rounded-full ${colors.bg}`}>
                                                <Text className={`text-xs font-bold ${colors.text}`}>
                                                    {wallet.type}
                                                </Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </Animated.View>
                            );
                        })
                    )}
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(600)} className="mt-8 mb-10">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-xl font-bold text-cyan-300 tracking-wide neon-text">TRANSACTIONS RÉCENTES</Text>
                        <TouchableOpacity onPress={() => router.push('/transactions')}>
                            <Text className="text-cyan-400 font-medium tracking-wide neon-text">VOIR TOUT</Text>
                        </TouchableOpacity>
                    </View>

                    {transactions.length === 0 ? (
                        <View className="bg-black/50 rounded-xl p-6 border border-cyan-500/20 items-center">
                            <MaterialIcons name="receipt" size={40} color="#06b6d4" />
                            <Text className="text-white text-lg mt-2">Aucune transaction</Text>
                            <Text className="text-cyan-300/70 text-center mt-1">
                                Créez votre première transaction
                            </Text>
                        </View>
                    ) : (
                        transactions.slice(0, 5).map((transaction, index) => (
                            <Animated.View
                                key={transaction.id}
                                entering={FadeInUp.delay(700 + index * 100)}
                                className="bg-black/50 rounded-xl p-4 mb-3 border border-cyan-500/20 shadow-sm"
                            >
                                <TouchableOpacity onPress={() => router.push('/transactions')}>
                                    <View className="flex-row justify-between items-start">
                                        <View className="flex-1">
                                            <Text className="font-medium text-white">
                                                {transaction.description || 'Transaction sans description'}
                                            </Text>
                                            <Text className="text-cyan-300/70 text-sm mt-1">
                                                {new Date(transaction.date).toLocaleDateString('fr-FR')}
                                            </Text>
                                            {transaction.labels && transaction.labels.length > 0 && (
                                                <View className="flex-row flex-wrap mt-2">
                                                    {transaction.labels.slice(0, 3).map((label, i) => (
                                                        <View key={i} className="bg-cyan-500/10 px-2 py-1 rounded mr-2 mb-1 border border-cyan-500/20">
                                                            <Text className="text-xs text-cyan-300">{label.name}</Text>
                                                        </View>
                                                    ))}
                                                </View>
                                            )}
                                        </View>
                                        <Text className={`text-lg font-bold ${transaction.type === 'IN' ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {transaction.type === 'IN' ? '+' : '-'}{transaction.amount.toLocaleString('fr-FR')} Ar
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        ))
                    )}
                </Animated.View>
            </View>
        </ScrollView>
    );
}