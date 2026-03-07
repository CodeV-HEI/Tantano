import { CreationGoal, Wallet } from '@/clients';
import { useAuth } from '@/contexts/AuthContext';
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

const CreationGoalModal = ({ isVisible, onclose, newGoal }: { isVisible: boolean, onclose: () => void, newGoal: CreationGoal }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    // Fetch des wallets pour le Picker
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
        color: "#06b6d4", 
        iconRef: "flag",
        walletId: "" 
    });

    const updateForm = (key: keyof CreationGoal, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (goalData: CreationGoal) => {
            if (!user?.id) throw new Error("Utilisateur non connecté");

            // Adaptation à l'interface CreateOneGoalRequest
            const res = await goalAPI.createOneGoal({
                accountId: user.id,
                walletId: goalData.walletId || "",
                creationGoal: {
                    ...goalData,
                    // S'assurer que les dates sont bien des objets Date pour l'API
                    startingDate: goalData.startingDate ? new Date(goalData.startingDate) : new Date(),
                    endingDate: goalData.endingDate ? new Date(goalData.endingDate) : new Date(),
                }
            });
            return res;
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

    // Validation stricte (évite les undefined)
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
                    <View className="bg-white rounded-t-[40px] p-8 min-h-[70vh]">
                        <View className="w-12 h-1.5 bg-gray-100 rounded-full self-center mb-8" />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-8">
                                <View className='flex flex-row justify-between items-center'>
                                    <Text className="text-3xl font-black text-gray-900 italic">NEW GOAL</Text>             
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
                                    className="text-xl font-bold text-gray-800 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                                    placeholder="Nom de l'objectif"
                                    value={form.name}
                                    onChangeText={(val) => updateForm('name', val)}
                                />

                                {/* MONTANT */}
                                <View className="flex-row items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <Text className="text-xl font-bold mr-2" style={{ color: form.color }}>€</Text>
                                    <TextInput
                                        className="text-xl font-black text-gray-900 flex-1"
                                        placeholder="0"
                                        keyboardType="numeric"
                                        value={form.amount === 0 ? "" : form.amount?.toString()}
                                        onChangeText={(val) => updateForm('amount', Number(val) || 0)}
                                    />
                                </View>

                                {/* DATES (Simple Strings pour l'instant) */}
                                <View className="flex-row gap-x-4">
                                    <TextInput
                                        className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100"
                                        placeholder="Début (YYYY-MM-DD)"
                                        value={form.startingDate?.toString()}
                                        onChangeText={(val) => updateForm('startingDate', val)}
                                    />
                                    <TextInput
                                        className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100"
                                        placeholder="Fin (YYYY-MM-DD)"
                                        value={form.endingDate?.toString()}
                                        onChangeText={(val) => updateForm('endingDate', val)}
                                    />
                                </View>

                                {/* PICKERS */}
                                <CustomColorPicker value={form.color || "#06b6d4"} onChange={(c) => updateForm('color', c)} />
                                <IconPicker color={form.color || "#06b6d4"} value={form.iconRef || "flag"} onChange={(i: string) => updateForm('iconRef', i)} />

                                {/* PORTEFEUILLE */}
                                <View className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                    <Picker
                                        selectedValue={form.walletId}
                                        onValueChange={(itemValue) => updateForm('walletId', itemValue)}
                                    >
                                        <Picker.Item label="Sélectionner un compte..." value="" color="#9ca3af" />
                                        {wallets?.map((wallet : Wallet) => (
                                            <Picker.Item key={wallet.id} label={wallet.name} value={wallet.id} />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View className="flex-row items-center mt-12 mb-6 gap-x-4">
                                <TouchableOpacity onPress={resetAndClose} className="flex-1 py-4">
                                    <Text className="text-gray-400 font-bold text-center">ANNULER</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => mutate(form)}
                                    disabled={!isValid}
                                    style={{ backgroundColor: isValid ? form.color : '#f3f4f6' }}
                                    className="flex-[2] py-5 rounded-[24px]"
                                >
                                    <Text className={`font-black text-center text-lg ${isValid ? 'text-white' : 'text-gray-300'}`}>
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