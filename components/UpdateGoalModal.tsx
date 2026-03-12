import { Goal, Wallet } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { goalAPI, walletAPI } from '@/services/api';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
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

const UpdateGoalModal = ({ isVisible, onclose, newGoal }: { isVisible: boolean; onclose: () => void; newGoal: Goal }) => {
    const { user } = useAuth();
    const { theme } = useTheme();
    const { currency } = useCurrency();
    const queryClient = useQueryClient();

    const [form, setForm] = useState<Goal>(newGoal);

    useEffect(() => {
        if (newGoal) {
            const rate = currency?.rate || 1;
            setForm({
                ...newGoal,
                amount: newGoal.amount * rate,
            });
        }
    }, [newGoal, currency?.rate]);

    const { data: wallets } = useQuery({
        queryKey: ["wallets"],
        queryFn: async () => {
            if (!user) return [];
            const response = await walletAPI.getAll(user.id);
            return response?.data?.values || [];
        }
    });

    const updateForm = (key: keyof Goal, value: any) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const { mutate, isPending } = useMutation({
        mutationFn: async (goalData: Goal) => {
            const rate = currency?.rate || 1;
            const baseAmount = goalData.amount / rate;
            const payload = {
                ...goalData,
                amount: baseAmount,
            };
            return await goalAPI.updateOneGoal(
                user?.id || "",
                goalData.walletId || "",
                goalData.id || "",
                payload
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['goals'] });
            Toast.show({ type: 'success', text1: "Objectif mis à jour ! 🚀" });
            onclose();
        },
        onError: (error: any) => {
            Toast.show({ type: 'error', text1: "Erreur de mise à jour", text2: error.message });
        }
    });

    const isValid =
        (form.name?.trim()?.length ?? 0) > 0 &&
        (form.amount ?? 0) > 0 &&
        form.walletId !== "" &&
        !isPending;

    return (
        <Modal animationType="slide" transparent visible={isVisible} onRequestClose={onclose}>
            <View className="flex-1 bg-black/60 justify-end">
                <Pressable className="absolute inset-0" onPress={onclose} />

                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                    <View className={`rounded-t-[40px] p-8 min-h-[70vh] ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
                        <View className={`w-12 h-1.5 rounded-full self-center mb-8 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-100'}`} />

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View className="mb-8">
                                <View className='flex flex-row justify-between items-center'>
                                    <Text className={`text-3xl font-black italic ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                                        MODIFIER
                                    </Text>
                                    <Ionicons
                                        name={form.iconRef as any}
                                        size={50}
                                        color={form.color}
                                    />
                                </View>
                                <View className="h-1 w-12 rounded-full mt-1" style={{ backgroundColor: form.color }} />
                            </View>

                            <View className="gap-y-6">
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
                                <View className={`flex-row items-center p-4 rounded-2xl border ${theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700'
                                    : 'bg-gray-50 border-gray-100'
                                    }`}>
                                    <Text className="text-xl font-bold mr-2" style={{ color: form.color }}>
                                        {currency?.value || 'MGA'}
                                    </Text>
                                    <TextInput
                                        className={`text-xl font-black flex-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                                        keyboardType="numeric"
                                        placeholder="0"
                                        placeholderTextColor={theme === 'dark' ? '#64748b' : '#9ca3af'}
                                        value={form.amount?.toString()}
                                        onChangeText={(val) => updateForm('amount', Number(val))}
                                    />
                                </View>

                                {/* COULEUR & ICÔNE */}
                                <CustomColorPicker
                                    value={form.color || "#06b6d4"}
                                    onChange={(c) => updateForm('color', c)}
                                />
                                <IconPicker
                                    color={form.color || "#06b6d4"}
                                    value={form.iconRef || 'flag'}
                                    onChange={(i: string) => updateForm('iconRef', i)}
                                />

                                {/* WALLET SELECTION */}
                                <View className={`rounded-2xl border overflow-hidden ${theme === 'dark'
                                    ? 'bg-slate-800 border-slate-700'
                                    : 'bg-gray-50 border-gray-100'
                                    }`}>
                                    <Picker
                                        selectedValue={form.walletId}
                                        onValueChange={(itemValue) => updateForm('walletId', itemValue)}
                                        dropdownIconColor={theme === 'dark' ? '#fff' : '#000'}
                                    >
                                        <Picker.Item
                                            label="Changer de portefeuille..."
                                            value=""
                                            color={theme === 'dark' ? '#94a3b8' : '#9ca3af'}
                                        />
                                        {wallets?.map((wallet: Wallet) => (
                                            <Picker.Item
                                                key={wallet.id}
                                                label={wallet.name}
                                                value={wallet.id}
                                                color={theme === 'dark' ? '#fff' : '#000'}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View className="flex-row items-center mt-12 mb-6 gap-x-4">
                                <TouchableOpacity onPress={onclose} className="flex-1 py-4">
                                    <Text className={`font-bold text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                                        ANNULER
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => mutate(form)}
                                    disabled={!isValid}
                                    style={{
                                        backgroundColor: isValid ? form.color : (theme === 'dark' ? '#334155' : '#f3f4f6'),
                                        opacity: isValid ? 1 : 0.6
                                    }}
                                    className="flex-[2] py-5 rounded-[24px]"
                                >
                                    <Text className={`font-black text-center text-lg ${isValid ? 'text-white' : (theme === 'dark' ? 'text-gray-500' : 'text-gray-300')
                                        }`}>
                                        {isPending ? "CHARGEMENT..." : "MODIFIER"}
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

export default UpdateGoalModal;