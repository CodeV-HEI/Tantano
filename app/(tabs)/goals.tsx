import { CreationGoal, Goal } from "@/clients";
import CreationGoalModal from "@/components/CreationModal";
import GoalItem from "@/components/DropDown";
import SearchBar from "@/components/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { goalAPI } from "@/services/api";
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";


export default function GoalsScreen() {
  const { user } = useAuth();
  const [isVisible, setVisible] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setName(searchInput);
      setPage(1); 
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading } = useQuery<Goal[], Error>({
    queryKey: ["goals", page, name], // refetch automatique si page ou name change
    queryFn: async (criterias) => {
      try {
        if (!user) return [];
        const response = await goalAPI.getAllGoals(criterias);
        const total = response.values?.length || 0
        setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
        return response?.values || [];
      } catch (error) {
        console.error("Erreur Query Goals:", error);
        return [];
      }
    },
  });

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

        {/* Barre de recherche */}
        <View className="mb-6">
          <SearchBar
            value={searchInput}
            onChangeText={setSearchInput}
          />
        </View>

        {data && data.length > 0 ? (
          <>
            <View className="gap-y-4">
              {data.map((item) => (
                <GoalItem key={item.id} goals={item} />
              ))}
            </View>

            {/* Pagination */}
            <View className="flex-row items-center justify-center gap-x-3 mt-8">
              <TouchableOpacity
                onPress={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  backgroundColor: page === 1 ? undefined : '#06b6d4',
                  opacity: page === 1 ? 0.4 : 1,
                }}
                className="w-10 h-10 rounded-full items-center justify-center border border-slate-200 dark:border-slate-700"
              >
                <Ionicons name="chevron-back" size={18} color={page === 1 ? '#94a3b8' : 'white'} />
              </TouchableOpacity>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === page;
                return (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setPage(p)}
                    style={isActive ? { backgroundColor: '#06b6d4' } : undefined}
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      isActive ? '' : 'border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Text className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {p}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  backgroundColor: page === totalPages ? undefined : '#06b6d4',
                  opacity: page === totalPages ? 0.4 : 1,
                }}
                className="w-10 h-10 rounded-full items-center justify-center border border-slate-200 dark:border-slate-700"
              >
                <Ionicons name="chevron-forward" size={18} color={page === totalPages ? '#94a3b8' : 'white'} />
              </TouchableOpacity>
            </View>

            <Text className="text-center text-slate-400 text-xs mt-2">
              Page {page} sur {totalPages}
            </Text>
          </>
        ) : (
          <View className="mt-32 items-center justify-center">
            <Ionicons name="sparkles-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 text-lg mt-4">
              {searchInput ? `Aucun résultat pour "${searchInput}"` : 'Rien ici pour le moment'}
            </Text>
            {!searchInput && (
              <TouchableOpacity onPress={() => setVisible(true)} className="mt-4">
                <Text style={{ color: '#06b6d4' }} className="font-bold">
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
        style={{
          backgroundColor: '#06b6d4',
          shadowColor: '#06b6d4',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 10,
        }}
        onPress={() => setVisible(true)}
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
