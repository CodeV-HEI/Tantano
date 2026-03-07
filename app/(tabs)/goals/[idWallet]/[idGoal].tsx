import { Goal } from "@/clients";
import GoalDropdown from "@/components/DropDown";
import { useAuth } from "@/contexts/AuthContext";
import { goalAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function EachGoal() {
    const { idGoal, idWallet } = useLocalSearchParams<{ idGoal: string, idWallet: string }>();
    const { user } = useAuth();

    const { data, isLoading, error } = useQuery<Goal>({
        queryKey: ['goal', idGoal, idWallet], 
        queryFn: async () => {
            if (!user?.id || !idGoal || !idWallet) {
                throw new Error("Missing parameters");
            }

            const response = await goalAPI.getOneGoal({
                accountId: user.id,
                walletId: idWallet,
                goalId: idGoal
            });

            return response;
        },
        enabled: !!user?.id && !!idGoal && !!idWallet 
    });

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center">
                <ActivityIndicator color="#06b6d4" />
            </View>
        );
    }

    if (error || !data) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Goal Not found</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 p-4">
            <GoalDropdown goals={data} />
        </View>
    );
}