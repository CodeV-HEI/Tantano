import { useTransactionStore } from "@/store/useTransactionStore";
import { TransactionFilter, TransactionType } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
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

export default function FilterOptionsTransaction({
  onClose,
}: {
  onClose: () => void;
}) {
  const { setFilter, filter, wallets, labels } = useTransactionStore();
  const [walletFilter, setWalletFilter] = useState<string>(
    filter.walletId || "",
  );
  const [walletSelected, setWalletSelected] = useState<string>(
    filter.walletId || "",
  );
  const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>(
    filter.type || undefined,
  );
  const [typeSelected, setTypeSelected] = useState<string | undefined>(
    filter.type || undefined,
  );
  const [labelFilter, setLabelFilter] = useState<string[]>(filter.label || []);
  const [sortBy, setSortBy] = useState<"date" | "amount">(
    filter.sortBy || "date",
  );
  const [sort, setSort] = useState<"asc" | "desc">(filter.sort || "asc");
  const [amountMax, setAmountMax] = useState<number | undefined>(
    filter.maxAmount,
  );
  const [amountMin, setAmountMin] = useState<number | undefined>(
    filter.minAmount,
  );
  const [dateStart, setDateStart] = useState<Date | undefined>(undefined);
  const [showDateStart, setShowDateStart] = useState(false);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(undefined);
  const [showDateEnd, setShowDateEnd] = useState(false);

  const handleChangeNumberMax = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmountMax(Number(numericValue));
  };

  const handleChangeNumberMin = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    setAmountMin(Number(numericValue));
  };

  const handleChangeDateStart = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateStart;
    setDateStart(currentDate);
    setShowDateStart(false);
  };

  const handleChangeDateEnd = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateEnd;
    setDateEnd(currentDate);
    setShowDateEnd(false);
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
      startingDate: dateStart ? dateStart.toISOString().split("T")[0] : "",
      endingDate: dateEnd ? dateEnd.toISOString().split("T")[0] : "",
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
    <View style={{ padding: 20, gap: 16 }} className="relative">
      <Text className="text-gray-700 font-bold text-lg mb-2">
        Selectionner :
      </Text>
      <View className="mb-2">
        <Text className="text-gray-600 mb-4">- Par Wallet :</Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={wallets || []}
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
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-gray-400 text-base">
                Aucune Portefeuille trouvée
              </Text>
              <Link href="/transactions" className="text-blue-500 mt-2">
                Ajouter une Portefeuille
              </Link>
            </View>
          }
        />
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
        <Text className="text-gray-600 mb-4">- Par Etiquette : </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          data={labels || []}
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
          ListEmptyComponent={
            <View className="items-center mt-20">
              <Text className="text-gray-400 text-base">
                Aucune Etiquette trouvée
              </Text>
              <Link href="/transactions" className="text-blue-500 mt-2">
                Ajouter une Etiquette
              </Link>
            </View>
          }
        />
      </View>
      <View className="mb-2">
        {/* Amount Section */}
        <View className="mb-5">
          <Text className="text-gray-600 mb-4">- Par Montant (Ar) : </Text>

          <View className="flex-row gap-3">
            <TextInput
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-base"
              keyboardType="numeric"
              onChangeText={handleChangeNumberMin}
              value={amountMin ? amountMin.toString() : ""}
              placeholder="Minimum"
            />

            <TextInput
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 text-base"
              keyboardType="numeric"
              onChangeText={handleChangeNumberMax}
              value={amountMax ? amountMax.toString() : ""}
              placeholder="Maximum"
            />
          </View>
        </View>

        {/* Date Section */}
        <View>
          <Text className="text-gray-600 mb-4">- Par Date : </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setShowDateStart(true)}
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
            >
              <Text className="text-gray-700">
                {dateStart ? dateStart.toLocaleDateString() : "Date début"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowDateEnd(true)}
              className="flex-1 bg-gray-100 border border-gray-200 rounded-xl px-4 py-3"
            >
              <Text className="text-gray-700">
                {dateEnd ? dateEnd.toLocaleDateString() : "Date fin"}
              </Text>
            </Pressable>
          </View>
        </View>

        {showDateStart && (
          <DateTimePicker
            value={dateStart || new Date()}
            mode="date"
            onChange={handleChangeDateStart}
          />
        )}

        {showDateEnd && (
          <DateTimePicker
            value={dateEnd || new Date()}
            mode="date"
            onChange={handleChangeDateEnd}
          />
        )}
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
              className={`bg-gray-100 border border-gray-200 rounded-full px-4 py-2 ${
                sortBy === item.id ? "bg-purple-500 border-purple-500" : ""
              }`}
            >
              <Text
                className={`text-gray-600 text-sm ${
                  sortBy === item.id ? "text-white" : ""
                }`}
              >
                {item.name}
              </Text>
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
          <AntDesign name="clear" size={20} color="#2563eb" />
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
    </View>
  );
}
