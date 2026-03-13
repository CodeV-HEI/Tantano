import { useTheme } from "@/contexts/ThemeContext";
import { useTransactionStore } from "@/stores/useTransactionStore";
import { TransactionType } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Button,
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
  const { theme } = useTheme();
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
  const [amountMaxShow, setAmountMaxShow] = useState(false);
  const [amountMin, setAmountMin] = useState<number | undefined>(
    filter.minAmount,
  );
  const [amountMinShow, setAmountMinShow] = useState(false);
  const [tempMinAmount, setTempMinAmount] = useState<string>("");
  const [tempMaxAmount, setTempMaxAmount] = useState<string>("");
  const [dateStart, setDateStart] = useState<Date | undefined>(
    filter.startingDate ? new Date(filter.startingDate) : undefined,
  );
  const [showDateStart, setShowDateStart] = useState(false);
  const [dateEnd, setDateEnd] = useState<Date | undefined>(
    filter.endingDate ? new Date(filter.endingDate) : undefined,
  );
  const [showDateEnd, setShowDateEnd] = useState(false);

  const colors = {
    background: theme === "dark" ? "#1c1c1e" : "#ffffff",
    card: theme === "dark" ? "#2c2c2e" : "#f3f4f6",
    text: theme === "dark" ? "#f3f3f3" : "#111827",
    textSecondary: theme === "dark" ? "#d1d1d6" : "#6b7280",
    primary: "#A74BCA",
    success: "#10b981",
    danger: "#ef4444",
    info: "#2563eb",
    selectedWallet: theme === "dark" ? "#7c3aed" : "#a855f7",
    selectedType: theme === "dark" ? "#22c55e" : "#16a34a",
  };

  const handleChangeDateStart = (event: any, selectedDate?: Date) => {
    setDateStart(selectedDate || dateStart);
    setShowDateStart(false);
  };
  const handleChangeDateEnd = (event: any, selectedDate?: Date) => {
    setDateEnd(selectedDate || dateEnd);
    setShowDateEnd(false);
  };

  const toggleLabel = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setLabelFilter((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const filterOptionsSelected = () => {
    setFilter({
      walletId: walletFilter || undefined,
      type: typeFilter,
      label: labelFilter.length > 0 ? labelFilter : undefined,
      minAmount: amountMin,
      maxAmount: amountMax,
      startingDate: dateStart ? dateStart.toISOString().split("T")[0] : undefined,
      endingDate: dateEnd ? dateEnd.toISOString().split("T")[0] : undefined,
      sortBy,
      sort,
    });
    onClose(); // Ferme le panneau après application
  };

  const clearFilters = () => {
    setWalletFilter("");
    setWalletSelected("");
    setTypeFilter(undefined);
    setTypeSelected(undefined);
    setLabelFilter([]);
    setAmountMin(undefined);
    setAmountMax(undefined);
    setDateStart(undefined);
    setDateEnd(undefined);
    setSortBy("date");
    setSort("asc");
    setFilter({
      walletId: undefined,
      startingDate: undefined,
      endingDate: undefined,
      type: undefined,
      label: [],
      maxAmount: undefined,
      minAmount: undefined,
      sortBy: "date",
      sort: "asc",
    });
  };

  // Ouverture des modaux de saisie
  const openMinModal = () => {
    setTempMinAmount(amountMin?.toString() || "");
    setAmountMinShow(true);
  };
  const openMaxModal = () => {
    setTempMaxAmount(amountMax?.toString() || "");
    setAmountMaxShow(true);
  };

  const validateMin = () => {
    const val = parseFloat(tempMinAmount);
    if (!isNaN(val)) {
      setAmountMin(val);
    } else {
      setAmountMin(undefined);
    }
    setAmountMinShow(false);
  };

  const validateMax = () => {
    const val = parseFloat(tempMaxAmount);
    if (!isNaN(val)) {
      setAmountMax(val);
    } else {
      setAmountMax(undefined);
    }
    setAmountMaxShow(false);
  };

  return (
    <>
      {/* Barre d'actions en haut */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          justifyContent: "flex-end",
          gap: 8,
          padding: 16,
          zIndex: 10,
          backgroundColor: colors.background,
        }}
      >
        <Pressable
          style={{
            backgroundColor: colors.info + "33",
            padding: 10,
            borderRadius: 999,
          }}
          onPress={clearFilters}
        >
          <AntDesign name="clear" size={20} color={colors.info} />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: colors.success + "33",
            padding: 10,
            borderRadius: 999,
          }}
          onPress={filterOptionsSelected}
        >
          <AntDesign name="check" size={20} color={colors.success} />
        </Pressable>
        <Pressable
          style={{
            backgroundColor: colors.danger + "33",
            padding: 10,
            borderRadius: 999,
          }}
          onPress={onClose}
        >
          <AntDesign name="close" size={20} color={colors.danger} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 70, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: colors.text,
            fontWeight: "bold",
            fontSize: 18,
            marginBottom: 12,
          }}
        >
          Sélectionner :
        </Text>

        {/* Wallets */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Par Wallet :
          </Text>
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
                style={{
                  backgroundColor:
                    walletSelected === item.id
                      ? colors.selectedWallet
                      : colors.card,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color:
                      walletSelected === item.id
                        ? "#fff"
                        : colors.textSecondary,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center">
                <Text className="text-gray-400 text-base">
                  Aucun portefeuille trouvé
                </Text>
                <Link
                  href="/(tabs)/wallets"
                  className="text-blue-500 mt-1"
                >
                  Ajouter un portefeuille
                </Link>
              </View>
            }
          />
        </View>

        {/* Type */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Par Type :
          </Text>
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
                style={{
                  backgroundColor:
                    typeSelected === item.id
                      ? colors.selectedType
                      : colors.card,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color:
                      typeSelected === item.id ? "#fff" : colors.textSecondary,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Labels */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Par Étiquette :
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={labels || []}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => toggleLabel(item.id)}
                style={{
                  backgroundColor: labelFilter.includes(item.id)
                    ? colors.selectedWallet
                    : colors.card,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: labelFilter.includes(item.id)
                      ? "#fff"
                      : colors.textSecondary,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <View className="items-center">
                <Text className="text-gray-400 text-base">
                  Aucune étiquette trouvée
                </Text>
                <Link
                  href="/(tabs)/labels"
                  className="text-blue-500 mt-1"
                >
                  Ajouter une étiquette
                </Link>
              </View>
            }
          />
        </View>

        {/* Montant */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Par Montant (Ar) :
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 12,
              }}
              onPress={openMinModal}
            >
              <Text style={{ color: colors.text }}>
                {amountMin !== undefined ? amountMin : "Minimum"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 12,
              }}
              onPress={openMaxModal}
            >
              <Text style={{ color: colors.text }}>
                {amountMax !== undefined ? amountMax : "Maximum"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modals pour saisie des montants */}
        <Modal visible={amountMinShow} transparent animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: '80%', backgroundColor: colors.card, borderRadius: 12, padding: 20 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Saisir le montant minimum</Text>
              <TextInput
                keyboardType="numeric"
                value={tempMinAmount}
                onChangeText={setTempMinAmount}
                style={{ borderWidth: 1, borderColor: colors.textSecondary, borderRadius: 8, padding: 10, color: colors.text, marginBottom: 20 }}
                placeholderTextColor={colors.textSecondary}
                placeholder="0"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                <Button title="Annuler" onPress={() => setAmountMinShow(false)} color="#ef4444" />
                <Button title="OK" onPress={validateMin} color="#A74BCA" />
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={amountMaxShow} transparent animationType="fade">
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <View style={{ width: '80%', backgroundColor: colors.card, borderRadius: 12, padding: 20 }}>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Saisir le montant maximum</Text>
              <TextInput
                keyboardType="numeric"
                value={tempMaxAmount}
                onChangeText={setTempMaxAmount}
                style={{ borderWidth: 1, borderColor: colors.textSecondary, borderRadius: 8, padding: 10, color: colors.text, marginBottom: 20 }}
                placeholderTextColor={colors.textSecondary}
                placeholder="0"
              />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                <Button title="Annuler" onPress={() => setAmountMaxShow(false)} color="#ef4444" />
                <Button title="OK" onPress={validateMax} color="#A74BCA" />
              </View>
            </View>
          </View>
        </Modal>

        {/* Date */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Par Date :
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={() => setShowDateStart(true)}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.text }}>
                {dateStart ? dateStart.toLocaleDateString() : "Date début"}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowDateEnd(true)}
              style={{
                flex: 1,
                backgroundColor: colors.card,
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Text style={{ color: colors.text }}>
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

        {/* Trier */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Trier par :
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={sortBySelected}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSortBy(item.id as "date" | "amount")}
                style={{
                  backgroundColor:
                    sortBy === item.id ? colors.selectedWallet : colors.card,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: sortBy === item.id ? "#fff" : colors.textSecondary,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>

        {/* Sens du tri */}
        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: colors.textSecondary, marginBottom: 8 }}>
            - Sens du tri :
          </Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            data={sortSelected}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => setSort(item.id as "asc" | "desc")}
                style={{
                  backgroundColor:
                    sort === item.id ? colors.selectedType : colors.card,
                  borderRadius: 999,
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{
                    color: sort === item.id ? "#fff" : colors.textSecondary,
                  }}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
          />
        </View>
      </ScrollView>
    </>
  );
}
