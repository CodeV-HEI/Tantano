import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    TextInput,
    TouchableOpacity
} from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Rechercher un objectif…',
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [borderAnim, isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e2e8f0', '#06b6d4'],
  });

  return (
    <Animated.View
      style={{ borderColor }}
      className="flex-row items-center bg-white dark:bg-slate-900 rounded-2xl px-4 h-12 border"
    >
      <Ionicons
        name="search-outline"
        size={18}
        color={isFocused ? '#06b6d4' : '#94a3b8'}
      />

      <TextInput
        value={value}
        onChangeText={(text) => {
          onChangeText(text);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        className="flex-1 ml-3 text-slate-800 dark:text-white text-sm"
        returnKeyType="search"
        clearButtonMode="never"
        autoCorrect={false}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} hitSlop={8}>
          <Ionicons name="close-circle" size={18} color="#94a3b8" />
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
