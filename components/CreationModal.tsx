import { useAuth } from '@/context/AuthContext';
import { goalAPI, walletAPI } from '@/services/api';
import { CreationGoal, Goal, Wallet } from '@/types';
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
    
    const { data: wallets } = useQuery({
        queryKey: ["wallets"],
        queryFn: async () => {
            try {
                if (!user) return [];
                const response = await walletAPI.getAll(user.id);
                const data: Wallet[] = response?.data?.values || [];
                return data;
            } catch (error) {
                console.error('Error fetching wallets:', error);
                return [];
            }
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

    const { mutate, isPending } = useMutation<Goal, Error, CreationGoal>({
        mutationFn: async (goalData: CreationGoal) => {
            const res = await goalAPI.create(user?.id || "", goalData);
            return res.values as Goal;
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

    // Validation logic (added walletId check)
    const isValid = 
        form.name.trim().length > 0 && 
        form.amount > 0 && 
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
                                {/* SECTION NOM ET MONTANT */}
                                <View>
                                    <TextInput
                                        className="text-xl font-bold text-gray-800 p-4 bg-gray-50 rounded-2xl border border-gray-100"
                                        placeholder="Nom de l'objectif"
                                        placeholderTextColor="#9ca3af"
                                        value={form.name}
                                        onChangeText={(val) => updateForm('name', val)}
                                    />
                                    <View className="mt-4 flex-row items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <Text className="text-xl font-bold mr-2" style={{ color: form.color }}>€</Text>
                                        <TextInput
                                            className="text-xl font-black text-gray-900 flex-1"
                                            placeholder="Montant cible"
                                            keyboardType="numeric"
                                            value={form.amount === 0 ? "" : form.amount.toString()}
                                            onChangeText={(val) => updateForm('amount', +val)}
                                        />
                                    </View>
                                </View>

                                {/* SECTION DATES */}
                                <View className="flex-row gap-x-4">
                                    <TextInput
                                        className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-700"
                                        placeholder="Début (JJ/MM/AA)"
                                        value={form.startingDate}
                                        onChangeText={(val) => updateForm('startingDate', val)}
                                    />
                                    <TextInput
                                        className="flex-1 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-700"
                                        placeholder="Fin (JJ/MM/AA)"
                                        value={form.endingDate}
                                        onChangeText={(val) => updateForm('endingDate', val)}
                                    />
                                </View>

                                {/* CHOIX COULEUR NÉON */}
                                <View>
                                    <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[3px] mb-4 ml-1">Palette Néon</Text>
                                    <CustomColorPicker 
                                        value={form.color} 
                                        onChange={(c) => updateForm('color', c)} 
                                    />
                                </View>
                              
                                {/* CHOIX ICÔNE */}
                                <View>
                                    <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[3px] mb-4 ml-1">Icône</Text>
                                    <IconPicker 
                                        color={form.color} 
                                        value={form.iconRef} 
                                        onChange={(i: string) => updateForm('iconRef', i)}
                                    />
                                </View>

                                {/* CHOIX PORTEFEUILLE (PICKER) */}
                                <View>
                                    <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-[3px] mb-4 ml-1">Portefeuille Associé</Text>
                                    <View className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                                        <Picker
                                            selectedValue={form.walletId}
                                            onValueChange={(itemValue) => updateForm('walletId', itemValue)}
                                            dropdownIconColor={form.color}
                                        >
                                            <Picker.Item label="Sélectionner un compte..." value="" color="#9ca3af" />
                                            {wallets?.map((wallet) => (
                                                <Picker.Item 
                                                    key={wallet.id} 
                                                    label={wallet.name} 
                                                    value={wallet.id} 
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                </View>
                            </View>

                            <View className="flex-row items-center mt-12 mb-6 gap-x-4">
                                <TouchableOpacity onPress={resetAndClose} className="flex-1 py-4">
                                    <Text className="text-gray-400 font-bold text-center">ANNULER</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => mutate(form)}
                                    disabled={!isValid}
                                    style={{ 
                                        backgroundColor: isValid ? form.color : '#f3f4f6',
                                        shadowColor: isValid ? form.color : '#000',
                                        shadowOffset: { width: 0, height: 8 },
                                        shadowOpacity: isValid ? 0.3 : 0,
                                        shadowRadius: 12,
                                    }}
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
            <Toast />
        </Modal>
    );
};

export default CreationGoalModal;