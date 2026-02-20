import { useLabelStore } from "@/store/useLabelStore";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useWalletStore } from "@/store/useWalletStore";
import { TransactionFilter, TransactionType } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const transactionTypeSelected = [
  { id: "IN", name: "Ajouter" },
  { id: "OUT", name: "Retirer" },
];

const sortBySelected = [
  { id: "date", name: "Date" },
  { id: "amount", name: "Montant" },
];

const sortSelected = [
  { id: "asc", name: "Ascendant" },
  { id: "desc", name: "Descendant" },
];

export default function FilterTransaction({
  onClose,
}: {
  onClose: () => void;
}) {
  const { wallets } = useWalletStore();
  const { labels } = useLabelStore();
  const { setFilter } = useTransactionStore();
  const [walletFilter, setWalletFilter] = useState<string>("");
  const [walletSelected, setWalletSelected] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<TransactionType>();
  const [typeSelected, setTypeSelected] = useState<string>("");
  const [labelFilter, setLabelFilter] = useState<string[]>([]);
  const [amountMax, setAmountMax] = useState<number>(0);
  const [amountMin, setAmountMin] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const handleChangeNumberMax = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmountMax(Number(numericValue));
  };

  const handleChangeNumberMin = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmountMin(Number(numericValue));
  };

  const toggleLabel = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    setLabelFilter((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((item) => item !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const filterOptionsSelected = () => {
    const filters: TransactionFilter = {
      walletId: walletFilter,
      type: typeFilter,
      label: labelFilter,
      minAmount: amountMin,
      maxAmount: amountMax,
      startingDate: "",
      endingDate: "",
      sortBy: sortBy,
      sort: sort,
    };

    setFilter(filters);
  };

  const clearFilters = () => {
    const filters: TransactionFilter = {
      walletId: undefined,
      startingDate: undefined,
      endingDate: undefined,
      type: undefined,
      label: [],
      maxAmount: undefined,
      minAmount: undefined,
      sortBy: "date",
      sort: "asc",
    };

    setFilter(filters);
  };

  return (
    <ScrollView
      contentContainerStyle={{ padding: 20, paddingBottom: 60, gap: 16 }}
      showsVerticalScrollIndicator={true}
      className="relative"
    >
      <Text className="text-gray-700 font-bold text-lg mb-2">
        Filtres disponibles :
      </Text>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Par Wallet :</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={wallets}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setWalletFilter(item.id);
                setWalletSelected(item.id);
              }}
              className={`bg-gray-100 border border-gray-200 rounded-full px-4 py-2 ${walletSelected === item.id ? "bg-purple-500 border-purple-500" : ""}`}
            >
              <Text
                className={`text-gray-600 text-sm ${walletSelected === item.id ? "text-white" : ""}`}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- De : </Text>
        <Text>Pas pour le moment </Text>
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- A : </Text>
        <Text>Pas pour le moment </Text>
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Par Type : </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={transactionTypeSelected}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setTypeFilter(item.id as TransactionType);
                setTypeSelected(item.id);
              }}
              className={`bg-gray-100 border border-gray-200 rounded-full px-4 py-2 ${typeSelected === item.id ? "bg-green-500 border-green-500" : ""}`}
            >
              <Text
                className={`text-gray-600 text-sm ${typeSelected === item.id ? "text-white" : ""}`}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Par Catégorie : </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={labels}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                toggleLabel(item.id);
              }}
              className={`bg-gray-100 border border-gray-200 rounded-full px-4 py-2 ${labelFilter.includes(item.id) ? "bg-purple-500 border-purple-500" : ""}`}
            >
              <Text
                className={`text-gray-600 text-sm ${labelFilter.includes(item.id) ? "text-white" : ""}`}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Valeur max : </Text>
        <TextInput
          className="h-[55px] bg-gray-50 border border-gray-200 rounded-xl px-4 mb-2 text-lg font-semibold"
          keyboardType="numeric"
          onChangeText={handleChangeNumberMax}
          value={amountMax.toString()}
          placeholder="0"
        />
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Valeur min : </Text>
        <TextInput
          className="h-[55px] bg-gray-50 border border-gray-200 rounded-xl px-4 mb-2 text-lg font-semibold"
          keyboardType="numeric"
          onChangeText={handleChangeNumberMin}
          value={amountMin.toString()}
          placeholder="0"
        />
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Trier par : </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={sortBySelected}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSortBy(item.id as "date" | "amount");
              }}
              className={`bg-gray-100 border border-gray-200 rounded-full px-4 py-2 ${sortBy === item.id ? "bg-blue-500 border-blue-500" : ""}`}
            >
              <Text className={`text-gray-600 text-sm`}>{item.name}</Text>
            </Pressable>
          )}
        />
      </View>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Sens du tri : </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={sortSelected}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSort(item.id as "asc" | "desc");
              }}
              className={`bg-gray-100 border border-gray-200 rounded-full px-4 py-2 ${sort === item.id ? "bg-green-500 border-green-500" : ""}`}
            >
              <Text
                className={`text-gray-600 text-sm ${sort === item.id ? "text-white" : ""}`}
              >
                {item.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
      <View className="absolute top-0 left-0 right-0 flex-row justify-end p-4 gap-2">
        <Pressable
          className="bg-blue-50 p-2 rounded-full"
          onPress={clearFilters}
        >
          <AntDesign name="clear" size={20} color="#ef4444" />
        </Pressable>
        <Pressable
          className="bg-green-50 p-2 rounded-full"
          onPress={filterOptionsSelected}
        >
          <AntDesign name="check" size={20} color="#10b981" />
        </Pressable>
        <Pressable className="bg-red-50 p-2 rounded-full" onPress={onClose}>
          <AntDesign name="close" size={20} color="#ef4444" />
        </Pressable>
      </View>
    </ScrollView>
  );
}
