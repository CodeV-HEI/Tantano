import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    ActivityIndicator,
    RefreshControl,
    StatusBar
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useWalletStore, WalletType, Wallet } from '@/stores/useWalletStore';
import { useRouter } from 'expo-router';

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


    const [refreshing, setRefreshing] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showIncomeForm, setShowIncomeForm] = useState<string | null>(null);


    const [newWalletName, setNewWalletName] = useState('');
    const [newWalletDescription, setNewWalletDescription] = useState('');
    const [newWalletType, setNewWalletType] = useState<WalletType>('CASH');


    const [incomeAmount, setIncomeAmount] = useState('');
    const [incomeDay, setIncomeDay] = useState('1');


    const [filterType, setFilterType] = useState<'ALL' | WalletType>('ALL');
    const [showInactive, setShowInactive] = useState(false);


    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    useEffect(() => {
        if (user?.id) {
            console.log('Chargement des wallets pour user:', user.id);
            fetchWallets(user.id);
        }
    }, [user?.id]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) {
            await fetchWallets(user.id);
        }
        setRefreshing(false);
    };

    const handleCreateWallet = async () => {
        if (!user?.id) {
            Alert.alert('Erreur', 'Utilisateur non connecté');
            return;
        }

        const created = await createWallet(user.id, {
            name: newWalletName,
            description: newWalletDescription,
            type: newWalletType
        });

        if (created) {
            setNewWalletName('');
            setNewWalletDescription('');
            setNewWalletType('CASH');
            setShowAddForm(false);
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        if (!user?.id) return;
        await toggleWalletActive(user.id, id, isActive);
    };

    const handleUpdateAutomaticIncome = async (walletId: string) => {
        if (!user?.id) return;

        const amount = parseFloat(incomeAmount);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Erreur', 'Montant invalide');
            return;
        }

        const day = parseInt(incomeDay) || 1;
        if (day < 1 || day > 31) {
            Alert.alert('Erreur', 'Le jour doit être entre 1 et 31');
            return;
        }

        await updateAutomaticIncome(user.id, walletId, {
            type: 'MENSUAL',
            amount,
            paymentDay: day
        });

        setShowIncomeForm(null);
        setIncomeAmount('');
        setIncomeDay('1');
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


    const getWalletTypeStyle = (type: WalletType) => {
        switch (type) {
            case 'CASH':
                return {
                    bg: theme === 'dark' ? 'bg-yellow-500/20' : 'bg-yellow-100',
                    text: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
                    border: theme === 'dark' ? 'border-yellow-500/30' : 'border-yellow-300',
                    icon: 'money' as const,
                    gradient: theme === 'dark' ? 'from-yellow-500/20 to-yellow-600/20' : 'from-yellow-400/20 to-yellow-500/20'
                };
            case 'MOBILE_MONEY':
                return {
                    bg: theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100',
                    text: theme === 'dark' ? 'text-green-400' : 'text-green-600',
                    border: theme === 'dark' ? 'border-green-500/30' : 'border-green-300',
                    icon: 'phone-android' as const,
                    gradient: theme === 'dark' ? 'from-green-500/20 to-green-600/20' : 'from-green-400/20 to-green-500/20'
                };
            case 'BANK':
                return {
                    bg: theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100',
                    text: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
                    border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300',
                    icon: 'account-balance' as const,
                    gradient: theme === 'dark' ? 'from-blue-500/20 to-blue-600/20' : 'from-blue-400/20 to-blue-500/20'
                };
            case 'DEBT':
                return {
                    bg: theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100',
                    text: theme === 'dark' ? 'text-red-400' : 'text-red-600',
                    border: theme === 'dark' ? 'border-red-500/30' : 'border-red-300',
                    icon: 'warning' as const,
                    gradient: theme === 'dark' ? 'from-red-500/20 to-red-600/20' : 'from-red-400/20 to-red-500/20'
                };
            default:
                return {
                    bg: theme === 'dark' ? 'bg-gray-500/20' : 'bg-gray-100',
                    text: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
                    border: theme === 'dark' ? 'border-gray-500/30' : 'border-gray-300',
                    icon: 'account-balance-wallet' as const,
                    gradient: theme === 'dark' ? 'from-gray-500/20 to-gray-600/20' : 'from-gray-400/20 to-gray-500/20'
                };
        }
    };


    const StatCard = ({ title, value, icon, color }: { title: string; value: string; icon: keyof typeof MaterialIcons.glyphMap; color: string }) => (
        <View className={`flex-1 ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mx-1`}>
        <View className="flex-row items-center mb-2">
        <MaterialIcons name={icon} size={20} color={color} />
        <Text className={`ml-2 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{title}</Text>
        </View>
        <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</Text>
        </View>
    );

    const SettingItem = ({
        icon,
        title,
        description,
        rightComponent
    }: {
        icon: keyof typeof MaterialIcons.glyphMap;
        title: string;
        description?: string;
        rightComponent?: React.ReactNode;
    }) => (
        <View className="flex-row items-center justify-between py-4 px-2 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/10'} items-center justify-center mr-3`}>
        <MaterialIcons name={icon} size={22} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
        </View>
        <View className="flex-1">
        <Text className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}>{title}</Text>
        {description && (
            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-sm mt-0.5`}>{description}</Text>
        )}
        </View>
        </View>
        {rightComponent}
        </View>
    );


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

        <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
        <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

        <View className="px-4 pt-8">

        <Animated.View entering={FadeInUp.duration(600)} className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
        <TouchableOpacity
        onPress={() => router.back()}
        className={`p-2 rounded-xl ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} mr-3`}
        >
        <MaterialIcons
        name="arrow-back"
        size={24}
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        </TouchableOpacity>
        <Text className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
        Portefeuilles
        </Text>
        </View>
        <TouchableOpacity
        onPress={() => setShowAddForm(!showAddForm)}
        className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-cyan-500/20' : 'bg-cyan-400/20'}`}
        >
        <MaterialIcons
        name={showAddForm ? 'close' : 'add'}
        size={24}
        color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
        />
        </TouchableOpacity>
        </Animated.View>

        {wallets.length > 0 && (
            <Animated.View entering={FadeInUp.delay(100)} className="flex-row mb-6">
            <StatCard
            title="SOLDE TOTAL"
            value={`${totalBalance.toLocaleString('fr-FR')} Ar`}
            icon="account-balance"
            color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
            />
            <StatCard
            title="ACTIFS"
            value={`${activeCount}`}
            icon="check-circle"
            color={theme === 'dark' ? '#4ade80' : '#16a34a'}
            />
            <StatCard
            title="INACTIFS"
            value={`${inactiveCount}`}
            icon="remove-circle"
            color={theme === 'dark' ? '#f87171' : '#dc2626'}
            />
            </Animated.View>
        )}

        <View className="flex-row justify-between mb-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        <TouchableOpacity
        onPress={() => setFilterType('ALL')}
        className={`mr-2 px-4 py-2 rounded-full ${
            filterType === 'ALL'
            ? theme === 'dark'
            ? 'bg-cyan-500/20 border-cyan-500'
            : 'bg-cyan-400/20 border-cyan-400'
            : theme === 'dark'
            ? 'bg-gray-900/50 border-gray-700'
            : 'bg-cyan-50/50 border-gray-200'
        } border`}
        >
        <Text className={`font-medium ${
            filterType === 'ALL'
            ? theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'
            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
        Tous
        </Text>
        </TouchableOpacity>

        {(['CASH', 'MOBILE_MONEY', 'BANK', 'DEBT'] as WalletType[]).map((type) => {
            const style = getWalletTypeStyle(type);
            return (
                <TouchableOpacity
                key={type}
                onPress={() => setFilterType(type)}
                className={`mr-2 px-4 py-2 rounded-full ${
                    filterType === type
                    ? style.bg + ' ' + style.border
                    : theme === 'dark'
                    ? 'bg-gray-900/50 border-gray-700'
                    : 'bg-cyan-50/50 border-gray-200'
                } border`}
                >
                <Text className={`font-medium ${
                    filterType === type ? style.text : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                {type.replace('_', ' ')}
                </Text>
                </TouchableOpacity>
            );
        })}
        </ScrollView>

        <TouchableOpacity
        onPress={() => setShowInactive(!showInactive)}
        className={`px-4 py-2 rounded-full border ${
            showInactive
            ? theme === 'dark'
            ? 'bg-red-500/20 border-red-500/30'
            : 'bg-red-100 border-red-300'
            : theme === 'dark'
            ? 'bg-gray-900/50 border-gray-700'
            : 'bg-cyan-50/50 border-gray-200'
        }`}
        >
        <Text className={`font-medium ${
            showInactive
            ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
            : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
        {showInactive ? 'Actifs' : '+ inactifs'}
        </Text>
        </TouchableOpacity>
        </View>

        {showAddForm && (
            <Animated.View entering={FadeInUp} className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-4`}>
            <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-3`}>
            NOUVEAU PORTEFEUILLE
            </Text>

            <TextInput
            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            placeholder="Nom du portefeuille *"
            placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
            value={newWalletName}
            onChangeText={setNewWalletName}
            />

            <TextInput
            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            placeholder="Description (optionnelle)"
            placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
            value={newWalletDescription}
            onChangeText={setNewWalletDescription}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {(['CASH', 'MOBILE_MONEY', 'BANK', 'DEBT'] as WalletType[]).map((type) => {
                const style = getWalletTypeStyle(type);
                return (
                    <TouchableOpacity
                    key={type}
                    onPress={() => setNewWalletType(type)}
                    className={`mr-2 px-4 py-2 rounded-full ${
                        newWalletType === type
                        ? style.bg + ' ' + style.border
                        : theme === 'dark'
                        ? 'bg-gray-800 border-gray-700'
                        : 'bg-gray-100 border-gray-200'
                    } border`}
                    >
                    <Text className={`font-medium ${
                        newWalletType === type ? style.text : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {type.replace('_', ' ')}
                    </Text>
                    </TouchableOpacity>
                );
            })}
            </ScrollView>

            <View className="flex-row justify-end">
            <TouchableOpacity
            onPress={() => setShowAddForm(false)}
            className="px-4 py-2 mr-2 rounded-xl bg-red-500/20"
            >
            <Text className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
            Annuler
            </Text>
            </TouchableOpacity>

            <TouchableOpacity
            onPress={handleCreateWallet}
            disabled={isCreating}
            className="px-4 py-2 rounded-xl bg-green-500/20"
            >
            {isCreating ? (
                <ActivityIndicator size="small" color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
            ) : (
                <Text className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                Créer
                </Text>
            )}
            </TouchableOpacity>
            </View>
            </Animated.View>
        )}


        <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-20`}>
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
        MES PORTEFEUILLES ({filteredWallets.length})
        </Text>

        {isLoading && wallets.length === 0 ? (
            <View className="py-10 items-center">
            <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
            Chargement des portefeuilles...
            </Text>
            </View>
        ) : filteredWallets.length === 0 ? (
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
        ) : (
            filteredWallets.map((wallet) => {
                if (!wallet || !wallet.id) return null;

                const style = getWalletTypeStyle(wallet.type);
                const isUpdatingThis = isUpdating[wallet.id];
                const isUpdatingIncomeThis = isUpdatingIncome[wallet.id];
                const isExpanded = (wallet as any)._showDetails;
                const isPremium = wallet.walletAutomaticIncome?.type === 'MENSUAL';
                const isShowingIncomeForm = showIncomeForm === wallet.id;

                return (
                    <View key={wallet.id} className="relative mb-3">
                    {/* Overlay de chargement */}
                    {(isUpdatingThis || isUpdatingIncomeThis) && (
                        <View className="absolute inset-0 bg-black/50 rounded-2xl z-10 items-center justify-center">
                        <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                        </View>
                    )}

                    <TouchableOpacity
                    onPress={() => toggleWalletDetails(wallet.id)}
                    activeOpacity={0.7}
                    >
                    <View className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} rounded-2xl p-4 border ${
                        wallet.isActive
                        ? theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-300/30'
                        : theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                    <View className="flex-row items-center">
                    {/* Icône */}
                    <View className={`w-12 h-12 rounded-xl ${style.bg} items-center justify-center mr-3`}>
                    <MaterialIcons name={style.icon} size={24} color={style.text} />
                    </View>

                    {/* Infos principales */}
                    <View className="flex-1">
                    <View className="flex-row items-center">
                    <Text className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {wallet.name}
                    </Text>
                    {!wallet.isActive && (
                        <View className={`ml-2 px-2 py-0.5 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <Text className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Inactif
                        </Text>
                        </View>
                    )}
                    {isPremium && (
                        <View className="ml-2">
                        <MaterialIcons name="stars" size={18} color={theme === 'dark' ? '#fbbf24' : '#d97706'} />
                        </View>
                    )}
                    </View>

                    {wallet.description && (
                        <Text className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                        {wallet.description}
                        </Text>
                    )}

                    <View className="flex-row items-center justify-between mt-2">
                    <Text className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {wallet.amount.toLocaleString('fr-FR')} Ar
                    </Text>
                    <View className={`px-3 py-1 rounded-full ${style.bg}`}>
                    <Text className={`text-xs font-bold ${style.text}`}>
                    {wallet.type.replace('_', ' ')}
                    </Text>
                    </View>
                    </View>
                    </View>


                    <MaterialIcons
                    name={isExpanded ? 'expand-less' : 'expand-more'}
                    size={24}
                    color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                    />
                    </View>
                    </View>
                    </TouchableOpacity>


                    {isExpanded && (
                        <View className={`mt-2 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'} rounded-2xl p-4 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                        {/* Actions */}
                        <View className="flex-row mb-4">
                        <TouchableOpacity
                        onPress={() => handleToggleActive(wallet.id, wallet.isActive)}
                        className={`flex-1 flex-row items-center justify-center p-3 mr-2 rounded-xl ${
                            wallet.isActive
                            ? theme === 'dark' ? 'bg-red-500/20' : 'bg-red-100'
                            : theme === 'dark' ? 'bg-green-500/20' : 'bg-green-100'
                        }`}
                        >
                        <MaterialIcons
                        name={wallet.isActive ? 'visibility-off' : 'visibility'}
                        size={20}
                        color={wallet.isActive
                            ? (theme === 'dark' ? '#f87171' : '#dc2626')
                            : (theme === 'dark' ? '#4ade80' : '#16a34a')
                        }
                        />
                        <Text className={`ml-2 font-medium ${
                            wallet.isActive
                            ? theme === 'dark' ? 'text-red-400' : 'text-red-600'
                            : theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>
                        {wallet.isActive ? 'Désactiver' : 'Activer'}
                        </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                        onPress={() => setShowIncomeForm(isShowingIncomeForm ? null : wallet.id)}
                        className={`flex-1 flex-row items-center justify-center p-3 rounded-xl ${
                            theme === 'dark' ? 'bg-purple-500/20' : 'bg-purple-100'
                        }`}
                        >
                        <MaterialIcons
                        name="auto-awesome"
                        size={20}
                        color={theme === 'dark' ? '#c084fc' : '#9333ea'}
                        />
                        <Text className={`ml-2 font-medium ${
                            theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                        }`}>
                        {isPremium ? 'Modifier' : 'Revenu auto'}
                        </Text>
                        </TouchableOpacity>
                        </View>

                        {isShowingIncomeForm && (
                            <View className={`${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-xl p-4 border ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}>
                            <Text className={`font-semibold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mb-3`}>
                            Configurer le revenu automatique (Premium)
                            </Text>

                            <TextInput
                            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                            placeholder="Montant mensuel (Ar)"
                            placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                            value={incomeAmount}
                            onChangeText={setIncomeAmount}
                            keyboardType="numeric"
                            />

                            <TextInput
                            className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl px-4 py-3 mb-3 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
                            placeholder="Jour du mois (1-31)"
                            placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                            value={incomeDay}
                            onChangeText={setIncomeDay}
                            keyboardType="numeric"
                            />

                            <View className="flex-row justify-end">
                            <TouchableOpacity
                            onPress={() => setShowIncomeForm(null)}
                            className="px-4 py-2 mr-2 rounded-xl bg-red-500/20"
                            >
                            <Text className={theme === 'dark' ? 'text-red-400' : 'text-red-600'}>
                            Annuler
                            </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                            onPress={() => handleUpdateAutomaticIncome(wallet.id)}
                            className="px-4 py-2 rounded-xl bg-green-500/20"
                            >
                            <Text className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>
                            Configurer
                            </Text>
                            </TouchableOpacity>
                            </View>
                            </View>
                        )}

                        {isPremium && !isShowingIncomeForm && (
                            <View className={`${theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-50'} rounded-xl p-3 border ${theme === 'dark' ? 'border-purple-500/30' : 'border-purple-200'}`}>
                            <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center">
                            <MaterialIcons name="payments" size={20} color={theme === 'dark' ? '#c084fc' : '#9333ea'} />
                            <Text className={`ml-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            Revenu mensuel
                            </Text>
                            </View>
                            <Text className={`font-bold ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                            +{wallet.walletAutomaticIncome?.amount.toLocaleString('fr-FR')} Ar
                            </Text>
                            </View>
                            <Text className={`text-xs ${theme === 'dark' ? 'text-purple-400/70' : 'text-purple-600/70'} mt-1`}>
                            Ajouté le {wallet.walletAutomaticIncome?.paymentDay}er de chaque mois
                            </Text>
                            </View>
                        )}
                        </View>
                    )}
                    </View>
                );
            })
        )}
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
