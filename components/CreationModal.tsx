import { useAuth } from '@/context/AuthContext';
import { goalAPI } from '@/services/api';
import { CreationGoal, Goal } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable, ScrollView, Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import Toast from 'react-native-toast-message';

const CreationGoalModal = ({ isVisible, onclose }: { isVisible: boolean, onclose: () => void }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [form, setForm] = useState <CreationGoal>({
        name: "",
        amount: 0,
        endingDate: "",
        color: "",
        iconRef: "",
        startingDate: "",
        walletId: ""
    });

    const { mutate, isPending } = useMutation<Goal, Error, CreationGoal>({
        mutationFn: async (newGoal: CreationGoal) => {
            const res = await goalAPI.create(user?.id || "", newGoal);
            return res.values as Goal;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            Toast.show({ type: 'success', text1: "Objectif créé ! 🎉" });
            resetAndClose();
        },
        onError: (error: any) => {
            Toast.show({
                type: 'error',
                text1: "Erreur",
                text2: error.message,
                position: 'bottom',
            });
        }
    });

    const resetAndClose = () => {
        setForm({ name: "", amount: 0, walletId: "", startingDate: "" , endingDate: "", color: "", iconRef: ""});
        onclose();
    };

    const isValid = form.name.trim().length > 0 && !isPending;

    return (
        <Modal animationType="slide" transparent visible={isVisible} onRequestClose={resetAndClose}>
            <Pressable className="flex-1 bg-black/50 justify-center" onPress={resetAndClose}>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <Pressable className="bg-white rounded-[32px] p-6 shadow-xl" onPress={(e) => e.stopPropagation()}>
                        
                        <ScrollView showsVerticalScrollIndicator={false} className="max-h-[80vh]">
                            <View className="mb-6">
                                <Text className="text-2xl font-bold text-gray-800">🎯 Nouvel Objectif</Text>
                                <Text className="text-gray-500">Prêt pour un nouveau défi ?</Text>
                            </View>

                            <View className="space-y-4">
                                <View>
                                    <Text className="text-gray-700 font-semibold mb-1 ml-1">Titre</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 focus:border-blue-500"
                                        placeholder="ex: Épargne Voyage"
                                        value={form.name}
                                        onChangeText={(val) => setForm({...form, name: val})}
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-semibold mb-1 ml-1">Montant cible</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800"
                                        placeholder="0.00"
                                        keyboardType="numeric"
                                        value={form.amount.toString()}
                                        onChangeText={(val) => setForm({...form, amount: +val})}
                                    />
                                </View>

                                <View>
                                    <Text className="text-gray-700 font-semibold mb-1 ml-1">Description</Text>
                                    <TextInput
                                        className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-gray-800 h-24"
                                        placeholder="Détails de l'objectif..."
                                        multiline
                                        textAlignVertical="top"
                                        value={form.startingDate}
                                        onChangeText={(val : string) => setForm({...form, startingDate: val})}
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-end items-center mt-8 space-x-3">
                                <TouchableOpacity onPress={resetAndClose} className="px-6 py-3">
                                    <Text className="text-gray-500 font-bold">Annuler</Text>
                                </TouchableOpacity>

                                <TouchableOpacity 
                                    onPress={()=>mutate(form)}
                                    disabled={!isValid}
                                    className={`px-10 py-4 rounded-2xl shadow-sm ${isValid ? 'bg-blue-600' : 'bg-blue-200'}`}
                                >
                                    <Text className="text-white font-bold text-center">
                                        {isPending ? "Chargement..." : "Créer"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        
                    </Pressable>
                </KeyboardAvoidingView>
            </Pressable>
        </Modal>
    );
};

export default CreationGoalModal;