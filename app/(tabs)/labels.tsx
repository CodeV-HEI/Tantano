import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLabelStore } from '@/stores/useLabelStore';
import { useRouter } from 'expo-router';

export default function LabelsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();

    const {
        labels,
        isLoading,
        isCreating,
        fetchLabels,
        createLabel,
        updateLabel,
        deleteLabel
    } = useLabelStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    useEffect(() => {
        if (user?.id) {
            console.log('Chargement des labels pour user:', user.id);
            fetchLabels(user.id);
        }
    }, [user?.id]);

    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) {
            await fetchLabels(user.id);
        }
        setRefreshing(false);
    };

    const handleCreateLabel = async () => {
        if (!user?.id) {
            Alert.alert('Erreur', 'Utilisateur non connecté');
            return;
        }
        if (!newLabelName.trim()) {
            Alert.alert('Erreur', 'Le nom du label est requis');
            return;
        }

        const created = await createLabel(user.id, newLabelName);
        if (created) {
            setNewLabelName('');
            setShowAddForm(false);
        }
    };

    const handleUpdateLabel = async () => {
        if (!user?.id || !editingId) return;
        if (!editValue.trim()) {
            Alert.alert('Erreur', 'Le nom du label est requis');
            return;
        }

        const updated = await updateLabel(user.id, editingId, editValue);
        if (updated) {
            setEditingId(null);
            setEditValue('');
        }
    };

    const filteredLabels = labels.filter(label =>
    label && label.name &&
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const isDefaultLabel = (name: string) => {
        return ['NOURRITURE', 'TRANSPORT', 'LOISIRS'].includes(name);
    };

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

        <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'} rounded-full opacity-10 blur-3xl`} />
        <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'} rounded-full opacity-10 blur-3xl`} />

        <View className="px-4 pt-8">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
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
        Labels
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
        </View>


        <View className={`flex-row items-center ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-xl px-4 py-2 mb-4`}>
        <MaterialIcons name="search" size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
        <TextInput
        className={`flex-1 ml-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}
        placeholder="Rechercher un label..."
        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
        value={searchQuery}
        onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
            </TouchableOpacity>
        )}
        </View>


        {showAddForm && (
            <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-4`}>
            <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-3`}>
            NOUVEAU LABEL
            </Text>
            <View className="flex-row items-center">
            <TextInput
            className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl px-4 py-3 mr-2 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            placeholder="Nom du label"
            placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
            value={newLabelName}
            onChangeText={setNewLabelName}
            autoFocus
            />
            <TouchableOpacity
            onPress={handleCreateLabel}
            disabled={isCreating}
            className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-green-500/20' : 'bg-green-400/20'}`}
            >
            {isCreating ? (
                <ActivityIndicator size="small" color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
            ) : (
                <MaterialIcons name="check" size={24} color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
            )}
            </TouchableOpacity>
            </View>
            </View>
        )}

        <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-20`}>
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
        TOUS LES LABELS ({filteredLabels.length})
        </Text>

        {isLoading && labels.length === 0 ? (
            <View className="py-10 items-center">
            <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
            Chargement des labels...
            </Text>
            </View>
        ) : filteredLabels.length === 0 ? (
            <View className="py-10 items-center">
            <View className={`w-20 h-20 rounded-full ${theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-400/10'} items-center justify-center mb-4`}>
            <MaterialIcons name="label-off" size={32} color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            </View>
            <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-2`}>
            {searchQuery ? 'Aucun résultat' : 'Aucun label'}
            </Text>
            <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} text-center`}>
            {searchQuery
                ? 'Essayez un autre terme de recherche'
        : 'Cliquez sur le bouton + pour créer votre premier label'}
        </Text>
        </View>
        ) : (
            filteredLabels.map(label => {
                const isDefault = isDefaultLabel(label.name);
                const isEditing = editingId === label.id;

                if (isEditing) {
                    return (
                        <View key={label.id} className="flex-row items-center py-2">
                        <TextInput
                        className={`flex-1 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} rounded-xl px-4 py-2 mr-2 border ${theme === 'dark' ? 'border-cyan-500' : 'border-cyan-400'}`}
                        value={editValue}
                        onChangeText={setEditValue}
                        autoFocus
                        placeholder="Nouveau nom"
                        placeholderTextColor={theme === 'dark' ? '#6b7280' : '#9ca3af'}
                        />
                        <TouchableOpacity onPress={handleUpdateLabel} className="p-2 mr-1">
                        <MaterialIcons name="check" size={22} color={theme === 'dark' ? '#4ade80' : '#16a34a'} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setEditingId(null)} className="p-2">
                        <MaterialIcons name="close" size={22} color={theme === 'dark' ? '#f87171' : '#dc2626'} />
                        </TouchableOpacity>
                        </View>
                    );
                }

                return (
                    <View key={label.id} className="flex-row items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <View className="flex-row items-center flex-1">
                    <View className={`w-8 h-8 rounded-lg ${isDefault ? 'bg-purple-500/20' : 'bg-cyan-500/20'} items-center justify-center mr-3`}>
                    <MaterialIcons
                    name={isDefault ? 'star' : 'label'}
                    size={16}
                    color={isDefault
                        ? (theme === 'dark' ? '#c084fc' : '#9333ea')
                        : (theme === 'dark' ? '#06b6d4' : '#0891b2')
                    }
                    />
                    </View>
                    <View>
                    <Text className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-base`}>
                    {label.name}
                    </Text>
                    {isDefault && (
                        <Text className={`text-xs ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}>
                        Par défaut
                        </Text>
                    )}
                    </View>
                    </View>
                    <View className="flex-row">
                    <TouchableOpacity
                    onPress={() => {
                        setEditingId(label.id);
                        setEditValue(label.name);
                    }}
                    className="p-2 mr-2"
                    >
                    <MaterialIcons
                    name="edit"
                    size={20}
                    color={theme === 'dark' ? '#06b6d4' : '#0891b2'}
                    />
                    </TouchableOpacity>
                    {!isDefault && (
                        <TouchableOpacity
                        onPress={() => user?.id && deleteLabel(user.id, label.id, label.name)}
                        className="p-2"
                        >
                        <MaterialIcons
                        name="delete"
                        size={20}
                        color={theme === 'dark' ? '#f87171' : '#dc2626'}
                        />
                        </TouchableOpacity>
                    )}
                    </View>
                    </View>
                );
            })
        )}
        </View>
        </View>
        </ScrollView>
    );
}
