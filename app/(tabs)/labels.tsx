import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useLabelStore } from '@/stores/useLabelStore';
import { useRouter } from 'expo-router';

import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { CreateForm } from './components/CreateForm';
import { EditForm } from './components/EditForm';
import { LabelList } from './components/LabelList';
import { EmptyState } from './components/EmptyState';

export default function LabelsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();


    const {
        labels,
        isLoading,
        isCreating,
        isUpdating,
        fetchLabels,
        createLabel,
        updateLabel,
        deleteLabel
    } = useLabelStore();


    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [refreshing, setRefreshing] = useState(false);


    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    useEffect(() => {
        if (user?.id) {
            fetchLabels(user.id);
        }
    }, [user?.id]);


    const filteredLabels = labels.filter(label =>
    label && label.name &&
    label.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) await fetchLabels(user.id);
        setRefreshing(false);
    };

    const handleCreateLabel = async (name: string) => {
        if (!user?.id) return;
        const created = await createLabel(user.id, name);
        if (created) {
            setShowCreateForm(false);
        }
    };

    const handleUpdateLabel = async (name: string) => {
        if (!user?.id || !editingId) return;
        const updated = await updateLabel(user.id, editingId, name);
        if (updated) {
            setEditingId(null);
            setEditingName('');
        }
    };

    const handleDeleteLabel = (id: string, name: string) => {
        if (!user?.id) return;
        deleteLabel(user.id, id, name);
    };

    const handleEditClick = (id: string, currentName: string) => {
        setEditingId(id);
        setEditingName(currentName);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
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

        <View className={`absolute top-10 -left-20 w-80 h-80 ${theme === 'dark' ? 'bg-purple-500' : 'bg-purple-300'}
        rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />
        <View className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === 'dark' ? 'bg-cyan-500' : 'bg-cyan-300'}
        rounded-full ${theme === 'dark' ? 'opacity-10' : 'opacity-5'} blur-3xl`} />

        <View className="px-4 pt-8">

        <Header
        showCreateForm={showCreateForm}
        onToggleForm={() => {
            setShowCreateForm(!showCreateForm);
            setEditingId(null);
        }}
        />


        <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        />


        {showCreateForm && (
            <CreateForm
            onCreate={handleCreateLabel}
            isCreating={isCreating}
            onCancel={() => setShowCreateForm(false)}
            />
        )}


        {editingId && (
            <EditForm
            initialName={editingName}
            onUpdate={handleUpdateLabel}
            isUpdating={isUpdating[editingId]}
            onCancel={handleCancelEdit}
            />
        )}


        <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mb-20`}>
        <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'} mb-4`}>
        TOUS LES LABELS ({filteredLabels.length})
        </Text>

        {isLoading && labels.length === 0 ? (
            <View className="py-10 items-center">
            <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
            </View>
        ) : (
            <>
            <LabelList
            labels={labels}
            isUpdating={isUpdating}
            onEdit={handleEditClick}
            onDelete={handleDeleteLabel}
            searchQuery={searchQuery}
            />

            {filteredLabels.length === 0 && (
                <EmptyState
                searchQuery={searchQuery}
                isLoading={isLoading}
                />
            )}
            </>
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
