import { CreationGoal, Wallet } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { goalAPI, walletAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';
import CustomColorPicker from './CustomColorPicker';
import IconPicker from './IconPicker';

const CreationGoalModal = ({ isVisible, onclose, newGoal }: { isVisible: boolean; onclose: () => void; newGoal: CreationGoal }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { currency } = useCurrency();
    const queryClient = useQueryClient();

    const { data: wallets } = useQuery({
        queryKey: ["wallets"],
        queryFn: async () => {
            if (!user?.id) return [];
            const response = await walletAPI.getAll(user.id);
            return response?.data?.values || [];
        }
    });

    const [form, setForm] = useState<CreationGoal>({
        ...newGoal,
        color: newGoal.color || "#06b6d4",
        iconRef: newGoal.iconRef || "flag",
        walletId: newGoal.walletId || ""
    });

    const updateForm = (key: keyof CreationGoal, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (goalData: CreationGoal) => {
            if (!user?.id) throw new Error("Utilisateur non connecté");
            if (!goalData.walletId) throw new Error("Veuillez sélectionner un portefeuille");

            // Conversion du montant de la devise utilisateur vers la devise de base (MGA)
            const rate = currency?.rate || 1;
            const baseAmount = goalData.amount / rate;

            const payload = {
                ...goalData,
                amount: baseAmount,
                startingDate: goalData.startingDate || new Date().toISOString().split('T')[0],
                endingDate: goalData.endingDate || new Date().toISOString().split('T')[0],
            };

            const res = await goalAPI.createOneGoal(user.id, goalData.walletId, payload);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            Toast.show({ type: 'success', text1: "Objectif créé ! 🎉" });
            resetAndClose();
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: "Erreur", text2: error.message });
        }
    });

    const resetAndClose = () => {
        setForm({ ...newGoal, color: "#06b6d4", iconRef: "flag", walletId: "" });
        onclose();
    };

    const isValid =
        (form.name?.trim()?.length ?? 0) > 0 &&
        (form.amount ?? 0) > 0 &&
        form.walletId !== "" &&
        !isPending;

    return (
        <Modal animationType="slide" transparent visible={isVisible} onRequestClose={resetAndClose}>
            <View className="flex-1 bg-black/60 justify-end">
                <Pressable className="absolute inset-0" onPress={resetAndClose} />

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View className={`rounded-t-[40px] p-8 min-h-[70vh] ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                        <View className="w-12 h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full self-center mb-8" />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-8">
                                <View className="flex flex-row justify-between items-center">
                                    <Text className={`text-3xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nouvel objectif</Text>
                                    <Ionicons
                                        name={form.iconRef as any}
                                        size={50}
                                        color={form.color}
                                    />
                                </View>
                                <View className="h-1 w-12 rounded-full mt-1" style={{ backgroundColor: form.color }} />
                            </View>

                            <View className="gap-y-8">
                                {/* NOM */}
                                <TextInput
                                    className={`text-xl font-bold p-4 rounded-2xl border ${theme === 'dark'
                                        ? 'bg-slate-800 border-slate-700 text-white'
                                        : 'bg-gray-50 border-gray-100 text-gray-800'
                                        }`}
                                    placeholder="Nom de l'objectif"
                                    placeholderTextColor={theme === 'dark' ? '#64748b' : '#9ca3af'}
                                    value={form.name}
                                    onChangeText={(val) => updateForm('name', val)}
                                />

                                {/* MONTANT */}
                                <View className={`flex-row items-center p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'
                                    }`}>
                                    <Text className="text-xl font-bold mr-2" style={{ color: form.color }}>
                                        {currency?.value || 'MGA'}
                                    </Text>
                                    <TextInput
                                        className={`text-xl font-black flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                        placeholder="0"
                                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#9ca3af'}
                                        keyboardType="numeric"
                                        value={form.amount === 0 ? "" : form.amount?.toString()}
                                        onChangeText={(val) => updateForm('amount', Number(val) || 0)}
                                    />
                                </View>

                                {/* DATES */}
                                <View className="flex-row gap-x-4">
                                    <TextInput
                                        className={`flex-1 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'
                                            }`}
                                        placeholder="Début (YYYY-MM-DD)"
                                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#9ca3af'}
                                        value={form.startingDate?.toString()}
                                        onChangeText={(val) => updateForm('startingDate', val)}
                                    />
                                    <TextInput
                                        className={`flex-1 p-4 rounded-2xl border ${theme === 'dark' ? 'bg-slate-800 border-slate-700 text-white' : 'bg-gray-50 border-gray-100 text-gray-800'
                                            }`}
                                        placeholder="Fin (YYYY-MM-DD)"
                                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#9ca3af'}
                                        value={form.endingDate?.toString()}
                                        onChangeText={(val) => updateForm('endingDate', val)}
                                    />
                                </View>

                                {/* PICKERS */}
                                <CustomColorPicker
                                    value={form.color || "#06b6d4"}
                                    onChange={(c) => updateForm('color', c)}
                                />
                                <IconPicker
                                    color={form.color || "#06b6d4"}
                                    value={form.iconRef || "flag"}
                                    onChange={(i: string) => updateForm('iconRef', i)}
                                />

                                {/* PORTEFEUILLE – Sélecteur adapté au thème */}
                                <View className={`rounded-2xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'
                                    }`}>
                                    <Picker
                                        selectedValue={form.walletId}
                                        onValueChange={(itemValue) => updateForm('walletId', itemValue)}
                                        dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}
                                    >
                                        <Picker.Item label="Sélectionner un compte..." value="" color={theme === 'dark' ? '#94a3b8' : '#9ca3af'} />
                                        {wallets?.map((wallet: Wallet) => (
                                            <Picker.Item key={wallet.id} label={wallet.name} value={wallet.id} color={theme === 'dark' ? '#fff' : '#000'} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View className="flex-row items-center mt-12 mb-6 gap-x-4">
                                <TouchableOpacity onPress={resetAndClose} className="flex-1 py-4">
                                    <Text className={`font-bold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                                        ANNULER
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => mutate(form)}
                                    disabled={!isValid}
                                    style={{ backgroundColor: isValid ? form.color : (theme === 'dark' ? '#334155' : '#f3f4f6') }}
                                    className="flex-[2] py-5 rounded-[24px]"
                                >
                                    <Text className={`font-black text-center text-lg ${isValid ? 'text-white' : (theme === 'dark' ? 'text-gray-500' : 'text-gray-300')}`}>
                                        {isPending ? "..." : "CRÉER"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

export default CreationGoalModal;