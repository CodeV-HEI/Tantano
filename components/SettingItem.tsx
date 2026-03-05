// SettingItem.tsx
import { useTheme } from "@/contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type SettingItemProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description?: string;
  rightComponent?: React.ReactNode;
};

const SettingItem: React.FC<SettingItemProps> = ({
  icon,
  title,
  description,
  rightComponent,
}) => {
  const { theme } = useTheme();

  return (
    <View className={`flex-row items-center justify-between py-4 px-2 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
      <View className="flex-row items-center flex-1">
        <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <MaterialIcons 
            name={icon} 
            size={22} 
            color={theme === 'dark' ? '#06b6d4' : '#0891b2'} 
          />
        </View>

        <View className="flex-1">
          <Text className={`font-semibold text-base ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </Text>

          {description && (
            <Text className={`text-sm mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              {description}
            </Text>
          )}
        </View>
      </View>

      {rightComponent}
    </View>
  );
};

export default SettingItem;