import { Goal } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native';
import UpdateGoalModal from './UpdateGoalModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GoalDropdown = ({ goals }: { goals: Goal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setVisible] = useState(false)

  const neonColors: Record<string, string> = {
    'neon-cyan': '#06b6d4',
    'neon-purple': '#8b5cf6',
    'neon-pink': '#ec4899',
    'neon-green': '#10b981',
    'neon-red': '#ef4444',
  };

  const activeColor = neonColors[goals.color] || goals.color || '#06b6d4';

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
  };

  return (
    <View className="w-full mb-3 px-1">
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={toggleDropdown}
        style={{ 
          borderLeftWidth: 4, 
          borderLeftColor: activeColor,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 2
        }}
        className="flex-row justify-between items-center p-5 bg-white rounded-r-2xl rounded-l-md"
      >
        <View className="flex-row items-center">
          <View style={{ backgroundColor: `${activeColor}15` }} className="p-2 rounded-xl mr-4">
            <Ionicons 
              name={goals.iconRef && (goals.iconRef in Ionicons.glyphMap) ? (goals.iconRef as any) : "trophy"} 
              size={24} 
              color={activeColor} 
            />
          </View>
          <View>
            <Text className="text-black text-lg font-bold">{goals.name}</Text>
            <Text className="text-gray-400 text-xs uppercase tracking-widest">{goals.amount} €</Text>
          </View>
        </View>
        
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#9CA3AF" 
        />
      </TouchableOpacity>

      {isOpen && (
        <View className="bg-white/50 border-x border-b border-gray-100 rounded-b-2xl p-5 mx-1 pt-2">
          <View className="space-y-4">
            <DetailRow label="Objectif Total" value={`${goals.amount} €`} color={activeColor} icon="cash-outline" />
            <DetailRow label="Échéance" value={goals.endingDate} icon="calendar-outline" />
            <DetailRow label="Portefeuille" value={goals.walletId} icon="wallet-outline" />
            <DetailRow label="Date de début" value={goals.startingDate} icon="time-outline" />
          </View>
          
          <TouchableOpacity 
            className="mt-4 py-2 items-center"
            onPress={() => setVisible(true) }
          >
            <Text style={{ color: activeColor }} className="font-bold text-xs uppercase tracking-tighter">
              Modifier l'objectif
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <UpdateGoalModal 
        isVisible={isVisible} 
        onclose={() => setVisible(false)} 
        newGoal={goals} 
      />
    </View>
  );
};

const DetailRow = ({ label, value, color, icon }: { label: string; value: string | number; color?: string; icon?: string }) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-50/50">
    <View className="flex-row items-center">
      {icon && <Ionicons name={icon as any} size={16} color="#9CA3AF" className="mr-2" />}
      <Text className="text-gray-500 text-sm ml-2">{label}</Text>
    </View>
    <Text 
      style={color ? { color: color } : { color: '#111827' }} 
      className="font-bold text-sm"
    >
      {value}
    </Text>
  </View>
);

export default GoalDropdown;