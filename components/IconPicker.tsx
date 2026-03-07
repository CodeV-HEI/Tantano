import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, View } from "react-native";

type Props = {
  value: string;
  onChange: (icon: string) => void;
  color: string;
};

const ICONS = [
  "flag",
  "trophy",
  "rocket",
  "trending-up",
  "star",
];

export default function IconPicker({ value, onChange, color }: Props) {
  return (
    <View className="flex-row flex-wrap justify-between px-1">
      {ICONS.map((icon) => {
        const isSelected = value === icon;

        return (
          <Pressable
            key={icon}
            onPress={() => onChange(icon)}
            // On joue sur l'opacité du fond quand sélectionné
            className={`
              w-[64px] h-[64px] rounded-[20px] items-center justify-center
              border-2
              ${isSelected ? "border-gray-800 bg-gray-900" : "border-gray-100 bg-white"}
            `}
            style={{
              // Effet d'ombre subtil
              shadowColor: isSelected ? color : "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isSelected ? 0.3 : 0.05,
              shadowRadius: 8,
              elevation: isSelected ? 6 : 1,
            }}
          >
            <Ionicons
              name={icon as any}
              size={26}
              // Si sélectionné, l'icône brille de sa propre couleur, sinon gris standard
              color={isSelected ? color : "#9ca3af"}
            />
            
            {/* Petit point de rappel de couleur sous l'icône sélectionnée */}
            {isSelected && (
                <View 
                    className="absolute bottom-1.5 w-1 h-1 rounded-full" 
                    style={{ backgroundColor: color }} 
                />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}