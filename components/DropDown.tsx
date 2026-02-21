import { Goal } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

const GoalModal = ({ goals }: { goals: Goal }) => {
  const [isVisible, setIsVisible] = useState(false);

  const neonColors: Record<string, string> = {
    'neon-cyan': '#06b6d4',
    'neon-purple': '#8b5cf6',
    'neon-pink': '#ec4899',
    'neon-green': '#10b981',
    'neon-red': '#ef4444',
  };

  const activeColor = neonColors[goals.color] || goals.color || '#06b6d4';

  return (
    <View className="w-full mb-3">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setIsVisible(true)}
        className="flex-row justify-between items-center p-4 bg-white border border-gray-100 rounded-2xl shadow-sm"
      >
        <View className="flex-row items-center space-x-3">
          <View style={{ backgroundColor: `${activeColor}15` }} className="p-2 rounded-xl">
            <Ionicons 
              name={goals.iconRef && (goals.iconRef in Ionicons.glyphMap) ? (goals.iconRef as any) : "trophy"} 
              size={22} 
              color={activeColor} 
            />
          </View>
          <Text className="text-black text-base font-semibold">{goals.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
      </TouchableOpacity>

      <Modal
        animationType="fade" 
      >
        <Pressable 
          className="flex-1 justify-center items-center bg-black/60 p-6" 
          onPress={() => setIsVisible(false)}
        >
          <Pressable 
            className="w-full bg-white rounded-[32px] p-6 shadow-2xl"
            onPress={(e) => e.stopPropagation()} 
          >
            <View className="items-center mb-6">
              <View 
                style={{ backgroundColor: `${activeColor}20`, borderColor: `${activeColor}40` }} 
                className="p-5 rounded-full border-2 mb-4"
              >
                <Ionicons 
                  name={goals.iconRef && (goals.iconRef in Ionicons.glyphMap) ? (goals.iconRef as any) : "trophy"} 
                  size={40} 
                  color={activeColor} 
                />
              </View>
              <Text className="text-2xl font-bold text-gray-900 text-center">{goals.name}</Text>
              <View style={{ backgroundColor: activeColor }} className="h-1 w-12 rounded-full mt-2" />
            </View>

            <View className="space-y-4 py-2">
              <DetailRow label="Objectif" value={`${goals.amount} €`} color={activeColor} icon="cash-outline" />
              <DetailRow label="Échéance" value={goals.endingDate} icon="calendar-outline" />
              <DetailRow label="Portefeuille" value={goals.walletId} icon="wallet-outline" />
              <DetailRow label="Date de début" value={goals.startingDate} icon="time-outline" />
            </View>

            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              style={{ backgroundColor: activeColor }}
              className="mt-8 p-4 rounded-2xl items-center shadow-md"
            >
              <Text className="text-white font-bold text-lg">C'est noté !</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const DetailRow = ({ label, value, color, icon }: { label: string; value: string | number; color?: string; icon?: string }) => (
  <View className="flex-row justify-between items-center py-2 border-b border-gray-50">
    <View className="flex-row items-center">
      {icon && <Ionicons name={icon as any} size={18} color="#9CA3AF" style={{ marginRight: 10 }} />}
      <Text className="text-gray-500 font-medium">{label}</Text>
    </View>
    <Text 
      style={color ? { color: color } : { color: '#111827' }} 
      className="font-bold text-base"
    >
      {value}
    </Text>
  </View>
);

export default GoalModal;