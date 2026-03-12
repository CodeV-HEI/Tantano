import { Goal } from '@/types/api';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, Text, TouchableOpacity, UIManager, View } from 'react-native';
import UpdateGoalModal from './UpdateGoalModal';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const GoalDropdown = ({ goals }: { goals: Goal }) => {
  const { theme } = useTheme();
  const { formatCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setVisible] = useState(false);

  const activeColor = goals.color || '#06b6d4';

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
        className={`flex-row justify-between items-center p-5 rounded-r-2xl rounded-l-md ${theme === 'dark' ? 'bg-slate-800' : 'bg-white'}`}
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
            <Text className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>{goals.name}</Text>
            <Text className={`text-xs uppercase tracking-widest ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
              {formatCurrency(goals.amount)}
            </Text>
          </View>
        </View>

        <Ionicons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={20}
          color={theme === 'dark' ? '#9CA3AF' : '#9CA3AF'}
        />
      </TouchableOpacity>

      {isOpen && (
        <View className={`border-x border-b rounded-b-2xl p-5 mx-1 pt-2 ${theme === 'dark' ? 'bg-slate-800/50 border-slate-700' : 'bg-white/50 border-gray-100'
          }`}>
          <View className="space-y-4">
            <DetailRow label="Objectif Total" value={formatCurrency(goals.amount)} color={activeColor} icon="cash-outline" theme={theme} />
            <DetailRow label="Échéance" value={goals.endingDate?.toString() || new Date().toString()} icon="calendar-outline" theme={theme} />
            <DetailRow label="Portefeuille" value={goals.walletId || ""} icon="wallet-outline" theme={theme} />
            <DetailRow label="Date de début" value={goals.startingDate || new Date().toDateString()} icon="time-outline" theme={theme} />
          </View>

          <TouchableOpacity className="mt-4 py-2 items-center" onPress={() => setVisible(true)}>
            <Text style={{ color: activeColor }} className="font-bold text-xs uppercase tracking-tighter">
              Modifier l&apos;objectif
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

const DetailRow = ({ label, value, color, icon, theme }: { label: string; value: string | number; color?: string; icon?: string; theme: 'light' | 'dark' }) => (
  <View className={`flex-row justify-between items-center py-3 border-b ${theme === 'dark' ? 'border-slate-700' : 'border-gray-50/50'
    }`}>
    <View className="flex-row items-center">
      {icon && <Ionicons name={icon as any} size={16} color={theme === 'dark' ? '#64748b' : '#9CA3AF'} className="mr-2" />}
      <Text className={`text-sm ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{label}</Text>
    </View>
    <Text
      style={color ? { color: color } : (theme === 'dark' ? { color: '#fff' } : { color: '#111827' })}
      className="font-bold text-sm"
    >
      {value}
    </Text>
  </View>
);

export default GoalDropdown;