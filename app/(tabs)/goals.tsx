import { CreationGoal } from "@/types/api";
import CreationGoalModal from "@/components/CreationModal";
import GoalItem from "@/components/DropDown";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { goalAPI } from "@/services/api";
import {
  scheduleGoalNotification,
  //useNotificationListener,
} from "@/services/notifications";
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import * as Notifications from 'expo-notifications';
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function GoalsScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [isVisible, setVisible] = useState(false);

  // États pour la recherche et pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState('');
  const [debouncedName, setDebouncedName] = useState('');

  // Activer l'écouteur de notifications (optionnel)
  // useNotificationListener();

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Requête API
  const { data: allGoals, isLoading } = useQuery({
    queryKey: ["goals", debouncedName],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await goalAPI.getAllGoals(user.id, {
        name: debouncedName || undefined,
      });
      return response?.data?.values || [];
    },
    enabled: !!user?.id
  });

  // Synchronisation des notifications
  useEffect(() => {
    const syncNotifs = async () => {
      if (allGoals && allGoals.length > 0) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        for (const goal of allGoals) {
          if (goal.endingDate) {
            const end = new Date(goal.endingDate).getTime();
            const now = Date.now();
            const secondsUntilEnd = (end - now) / 1000;
            if (secondsUntilEnd > 0 && secondsUntilEnd < 2592000) {
              await scheduleGoalNotification(goal, secondsUntilEnd);
            }
          }
        }
      }
    };
    syncNotifs();
  }, [allGoals]);

  // Pagination locale
  const { paginatedData, totalPages } = useMemo(() => {
    const data = allGoals || [];
    const total = Math.max(1, Math.ceil(data.length / pageSize));
    const start = (page - 1) * pageSize;
    return {
      paginatedData: data.slice(start, start + pageSize),
      totalPages: total
    };
  }, [allGoals, page]);

  const initialGoal: CreationGoal = {
    name: "",
    amount: 0,
    walletId: "",
    startingDate: new Date().toISOString(),
    endingDate: new Date().toISOString(),
    color: "#06b6d4",
    iconRef: "flag",
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center dark:bg-slate-950">
        <ActivityIndicator size="large" color="#06b6d4" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${theme === 'dark' ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="mt-8 mb-4">
          <Text className={`text-3xl font-extrabold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Objectifs
          </Text>
          <Text className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Gérez vos projets et votre épargne
          </Text>
        </View>

        <View className="mb-6">
          <SearchBar value={searchInput} onChangeText={setSearchInput} />
        </View>

        {paginatedData.length > 0 ? (
          <>
            <View className="gap-y-4">
              {paginatedData.map((item: CreationGoal & { id: string; accountId: string }, index: number) => (
                <GoalItem
                  key={index}
                  goals={{
                    ...item,
                    id: item.id,
                    accountId: item.accountId,
                  }}
                />
              ))}
            </View>

            {totalPages > 1 && (
              <View className="flex-row items-center justify-center gap-x-3 mt-8">
                <TouchableOpacity
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`w-10 h-10 rounded-full items-center justify-center border ${page === 1
                    ? theme === 'dark' ? 'border-slate-700 opacity-30' : 'border-slate-200 opacity-30'
                    : 'bg-cyan-500 border-transparent'
                    }`}
                >
                  <Ionicons name="chevron-back" size={18} color={page === 1 ? (theme === 'dark' ? '#334155' : '#94a3b8') : 'white'} />
                </TouchableOpacity>

                <View className={`px-4 py-2 rounded-full border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
                  <Text className={`text-sm font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>
                    {page} / {totalPages}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`w-10 h-10 rounded-full items-center justify-center border ${page === totalPages
                    ? theme === 'dark' ? 'border-slate-700 opacity-30' : 'border-slate-200 opacity-30'
                    : 'bg-cyan-500 border-transparent'
                    }`}
                >
                  <Ionicons name="chevron-forward" size={18} color={page === totalPages ? (theme === 'dark' ? '#334155' : '#94a3b8') : 'white'} />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View className="mt-32 items-center justify-center">
            <Ionicons name="sparkles-outline" size={48} color={theme === 'dark' ? '#334155' : '#cbd5e1'} />
            <Text className={`text-lg mt-4 text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-400'}`}>
              {searchInput ? `Aucun résultat pour "${searchInput}"` : 'Rien ici pour le moment'}
            </Text>
            {!searchInput && (
              <TouchableOpacity onPress={() => setVisible(true)} className="mt-4">
                <Text className="text-cyan-500 font-bold text-lg">
                  Créer votre premier objectif
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        <View className="h-32" />
      </ScrollView>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setVisible(true)}
        style={{
          backgroundColor: '#06b6d4',
          shadowColor: '#06b6d4',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 10,
        }}
        className="absolute bottom-10 right-8 w-16 h-16 rounded-full items-center justify-center border-2 border-white/20"
      >
        <Ionicons name="add" size={36} color="white" />
      </TouchableOpacity>

      <CreationGoalModal
        isVisible={isVisible}
        onclose={() => setVisible(false)}
        newGoal={initialGoal}
      />
    </View>
  );
}