import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  value: string;
  onChange: (color: string) => void;
};

// Ta palette spécifique "Neon"
const NEON_COLORS = [
  '#06b6d4', // neon-cyan
  '#8b5cf6', // neon-purple
  '#ec4899', // neon-pink
  '#10b981', // neon-green
  '#ef4444', // neon-red
];

export default function CustomColorPicker({ value, onChange }: Props) {
  return (
    <View className="flex-row flex-wrap gap-4 justify-between px-2">
      {NEON_COLORS.map((color) => {
        const isSelected = value === color;
        
        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            // On utilise scale-110 pour faire ressortir la couleur sélectionnée
            className={`w-12 h-12 rounded-2xl items-center justify-center border-4 ${
              isSelected ? "border-gray-800 scale-110" : "border-white shadow-sm"
            }`}
            style={{ 
              backgroundColor: color,
              // Optionnel : ajoute une petite ombre portée quand sélectionné
              elevation: isSelected ? 8 : 0,
            }}
          >
            {/* Petit indicateur intérieur si sélectionné */}
            {isSelected && (
              <View className="w-3 h-3 bg-white rounded-full shadow-sm" />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}