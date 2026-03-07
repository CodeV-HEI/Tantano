import { CreationGoal } from "@/clients";
import CreationGoalModal from "@/components/CreationModal";
import GoalItem from "@/components/DropDown";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/contexts/AuthContext";
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
  const [isVisible, setVisible] = useState(false);
  
  // États pour la recherche et pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [searchInput, setSearchInput] = useState('');
  const [debouncedName, setDebouncedName] = useState('');

  // 1. Activer l'écouteur de notifications pour la redirection (Deep Linking)
  //useNotificationListener();

  // Debounce pour la recherche
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(searchInput);
      setPage(1); 
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // 2. Requête API
  const { data: allGoals, isLoading } = useQuery({
    queryKey: ["goals", debouncedName],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await goalAPI.getAllGoals({
        accountId: user.id,
        name: debouncedName || undefined,
      });
      return response?.values || [];
    },
    enabled: !!user?.id
  });

  // 3. Synchronisation des notifications quand les goals sont chargés
  useEffect(() => {
    const syncNotifs = async () => {
      if (allGoals && allGoals.length > 0) {
        // Optionnel : Nettoyer les anciennes pour éviter les doublons
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        for (const goal of allGoals) {
          if (goal.endingDate) {
            const end = new Date(goal.endingDate).getTime();
            const now = Date.now();
            const secondsUntilEnd = (end - now) / 1000;

            // On planifie si c'est dans le futur (ex: max 1 mois d'intervalle pour iOS)
            if (secondsUntilEnd > 0 && secondsUntilEnd < 2592000) {
              await scheduleGoalNotification(goal, secondsUntilEnd);
            }
          }
        }
      }
    };
    syncNotifs();
  }, [allGoals]);

  // 4. Pagination locale
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
    startingDate: new Date(),
    endingDate: new Date(),
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
    <View className="flex-1 bg-gray-50 dark:bg-slate-950">
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="mt-8 mb-4">
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Objectifs
          </Text>
          <Text className="text-slate-500 text-sm">Gérez vos projets et votre épargne</Text>
        </View>

        <View className="mb-6">
          <SearchBar value={searchInput} onChangeText={setSearchInput} />
        </View>

        {paginatedData.length > 0 ? (
          <>
            <View className="gap-y-4">
              {paginatedData.map((item) => (
                <GoalItem key={item.id} goals={item} />
              ))}
            </View>

            {totalPages > 1 && (
              <View className="flex-row items-center justify-center gap-x-3 mt-8">
                <TouchableOpacity
                  onPress={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`w-10 h-10 rounded-full items-center justify-center border ${
                    page === 1 ? 'opacity-30 border-slate-200' : 'bg-cyan-500 border-transparent'
                  }`}
                >
                  <Ionicons name="chevron-back" size={18} color={page === 1 ? '#94a3b8' : 'white'} />
                </TouchableOpacity>

                <View className="bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-100 dark:border-slate-700">
                  <Text className="text-sm font-bold text-slate-700 dark:text-slate-200">
                    {page} / {totalPages}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`w-10 h-10 rounded-full items-center justify-center border ${
                    page === totalPages ? 'opacity-30 border-slate-200' : 'bg-cyan-500 border-transparent'
                  }`}
                >
                  <Ionicons name="chevron-forward" size={18} color={page === totalPages ? '#94a3b8' : 'white'} />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <View className="mt-32 items-center justify-center">
            <Ionicons name="sparkles-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 text-lg mt-4 text-center">
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