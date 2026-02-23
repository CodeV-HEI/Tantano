import CreationGoalModal from "@/components/CreationModal";
import GoalItem from "@/components/DropDown"; // On suppose que c'est ta carte d'affichage
import { useAuth } from "@/context/AuthContext";
import { goalAPI } from "@/services/api";
import { CreationGoal, Goal } from "@/types";
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";


export default function GoalsScreen() {
  const { user } = useAuth();
  const [isVisible, setVisible] = useState(false);

  const { data, isLoading } = useQuery<Goal[]>({
    queryKey: ["goals"],
    queryFn: async () => {
      try {
        if (!user) return [];
        const response = await goalAPI.getAll(user.id);
        return response?.data?.values || [];
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
    startingDate: "", 
    endingDate: "", 
    color: "#06b6d4", 
    iconRef: "flag" 
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
        <View className="mt-8 mb-6">
          <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Objectifs
          </Text>
          <Text className="text-slate-500 text-sm">Gérez vos projets et votre épargne</Text>
        </View>

        {data && data.length > 0 ? (
          <View className="gap-y-4"> 
            {data.map((item) => (
              <GoalItem key={item.id} goals={item} />
            ))}
          </View>
        ) : (
          <View className="mt-32 items-center justify-center">
            <Ionicons name="sparkles-outline" size={48} color="#cbd5e1" />
            <Text className="text-slate-400 text-lg mt-4">Rien ici pour le moment</Text>
            <TouchableOpacity 
              onPress={() => setVisible(true)}
              className="mt-4"
            >
              <Text style={{ color: '#06b6d4' }} className="font-bold">Créer votre premier objectif</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Padding pour ne pas que le dernier item soit caché par le bouton flottant */}
        <View className="h-32" />
      </ScrollView>

      {/* Bouton Flottant (FAB) */}
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

      {/* Le Modal de création */}
      <CreationGoalModal 
        isVisible={isVisible} 
        onclose={() => setVisible(false)} 
        newGoal={initialGoal} 
      />
    </View>
  );
}