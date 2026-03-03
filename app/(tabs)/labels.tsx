import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    RefreshControl,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
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
import { ConfirmationModal } from './components/ConfirmationModal'; 

export default function LabelsScreen() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const router = useRouter();


    const {
        labels,
        pagination,
        isLoading,
        isLoadingMore,
        isCreating,
        isUpdating,
        fetchLabels,
        loadMore,
        searchLabels,
        createLabel,
        updateLabel,
        deleteLabel,

        modalVisible,
        modalData,
        hideArchiveModal,
        confirmArchive
    } = useLabelStore();


    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [isSearching, setIsSearching] = useState(false);


    useEffect(() => {
        StatusBar.setBarStyle(theme === 'dark' ? 'light-content' : 'dark-content');
    }, [theme]);

    useEffect(() => {
        if (user?.id) {
            console.log(' Chargement initial des labels');
            fetchLabels(user.id, 1);
        }
    }, [user?.id]);


    useEffect(() => {
        const searchTimeout = setTimeout(() => {
            if (user?.id && searchQuery.trim()) {
                console.log('🔍 Recherche:', searchQuery);
                setIsSearching(true);
                searchLabels(user.id, searchQuery).finally(() => {
                    setIsSearching(false);
                });
            } else if (user?.id && !searchQuery.trim()) {
                fetchLabels(user.id, 1);
            }
        }, 500);

        return () => clearTimeout(searchTimeout);
    }, [searchQuery, user?.id]);


    const onRefresh = async () => {
        setRefreshing(true);
        if (user?.id) {
            await fetchLabels(user.id, 1);
        }
        setRefreshing(false);
    };

    const handleCreateLabel = async (name: string, color: string) => {
        if (!user?.id) return;

        console.log(' Création de label:', { name, color });

        const created = await createLabel(user.id, name, color);
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
        setShowCreateForm(false);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleLoadMore = () => {
        if (user?.id && pagination?.hasNext && !isLoadingMore && !isSearching) {
            console.log(' Chargement de plus de labels...');
            loadMore(user.id);
        }
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { nativeEvent } = event;

        const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent) => {
            const paddingToBottom = 100;
            return layoutMeasurement.height + contentOffset.y >=
                contentSize.height - paddingToBottom;
        };

        if (isCloseToBottom(nativeEvent)) {
            handleLoadMore();
        }
    };


    const filteredLabels = labels.filter(label =>
        label && label.name &&
        label.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
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
                        showCreateForm={showCreateForm}
                        onToggleForm={() => {
                            setShowCreateForm(!showCreateForm);
                            setEditingId(null);
                        }}
                    />


                    <View className="relative">
                        <SearchBar
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder={isSearching ? "Recherche en cours..." : "Rechercher un label..."}
                        />
                        {isSearching && (
                            <View className="absolute right-12 top-3">
                                <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                            </View>
                        )}
                    </View>


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

                    <View className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-cyan-50/50'} rounded-2xl p-4 mt-4`}>

                        <View className="flex-row justify-between items-center mb-4">
                            <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-cyan-800'}`}>
                                MES LABELS
                            </Text>
                            <View className="flex-row items-center">
                                <Text className={`text-sm mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {filteredLabels.length} affiché{filteredLabels.length > 1 ? 's' : ''}
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


                        {isLoading && labels.length === 0 ? (
                            <View className="py-10 items-center">
                                <ActivityIndicator size="large" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                                <Text className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-4`}>
                                    Chargement des labels...
                                </Text>
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

                                {filteredLabels.length === 0 && !isLoading && (
                                    <EmptyState
                                        searchQuery={searchQuery}
                                        isLoading={isLoading}
                                    />
                                )}

                                {isLoadingMore && (
                                    <View className="py-6 items-center">
                                        <ActivityIndicator size="small" color={theme === 'dark' ? '#06b6d4' : '#0891b2'} />
                                        <Text className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Chargement de plus de labels...
                                        </Text>
                                    </View>
                                )}

                                {pagination && !pagination.hasNext && labels.length > 0 && (
                                    <View className="py-4 items-center">
                                        <Text className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                                            — Tu as vu tous tes labels —
                                        </Text>
                                    </View>
                                )}
                            </>
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
                visible={modalVisible}
                title="Archiver le label"
                message={`Archiver "${modalData?.name}" ?\nCette action est réversible.`}
                onConfirm={confirmArchive}
                onCancel={hideArchiveModal}
                confirmText="Archiver"
                cancelText="Annuler"
            />
        </>
    );
}