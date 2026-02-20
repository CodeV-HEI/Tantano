import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function CustomDropdown () {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = [
    { label: 'Voyage', value: '1' },
    { label: 'Épargne', value: '2' },
  ];

  return (
    <View className="p-4 z-50">
      <TouchableOpacity 
        onPress={() => setIsOpen(!isOpen)}
        className={`flex-row justify-between items-center p-4 bg-white border rounded-xl ${isOpen ? 'border-blue-500' : 'border-gray-200'}`}
      >
        <Text className="text-gray-700">{selected ? selected.label : "Choisir..."}</Text>
        <Text>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View className="absolute top-20 left-4 right-4 bg-white border border-gray-100 rounded-xl shadow-lg">
          {options.map((item) => (
            <TouchableOpacity 
              key={item.value}
              onPress={() => { setSelected(item); setIsOpen(false); }}
              className="p-4 border-b border-gray-50 active:bg-gray-100"
            >
              <Text className="text-gray-800">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};