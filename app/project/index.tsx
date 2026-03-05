import Loader from "@/components/Loader";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { projectAPI } from "@/services/api";
import { Project } from "@/types";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    FlatList,
    Pressable,
    RefreshControl,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProjectsScreen() {
    const { user } = useAuth();
    const { theme } = useTheme();
    const router = useRouter();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchProjects = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await projectAPI.getAll(user.id);
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            Toast.show({
                type: "error",
                text1: "Erreur",
                text2: "Impossible de charger les projets.",
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user?.id]);

    useFocusEffect(
        useCallback(() => {
            fetchProjects();
        }, [fetchProjects])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchProjects();
    };

    const getStatusColor = (isArchived: boolean) => {
        if (isArchived) return theme === "dark" ? "text-gray-500" : "text-gray-400";
        return theme === "dark" ? "text-green-400" : "text-green-600";
    };

    const renderProjectCard = ({ item }: { item: Project }) => (
        <TouchableOpacity
            onPress={() => router.push(`/project/${item.id}`)}
            className={`mb-4 p-4 rounded-2xl border ${theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
                }`}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                    {item.iconRef ? (
                        <Text className="text-2xl mr-3">{item.iconRef}</Text>
                    ) : (
                        <View
                            className="w-10 h-10 rounded-full items-center justify-center mr-3"
                            style={{ backgroundColor: item.color || (theme === "dark" ? "#374151" : "#E5E7EB") }}
                        >
                            <MaterialIcons
                                name="build"
                                size={20}
                                color={theme === "dark" ? "#06b6d4" : "#0891b2"}
                            />
                        </View>
                    )}
                    <View className="flex-1">
                        <Text
                            className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"
                                }`}
                        >
                            {item.name}
                        </Text>
                        {item.description && (
                            <Text
                                className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                    }`}
                                numberOfLines={1}
                            >
                                {item.description}
                            </Text>
                        )}
                    </View>
                </View>

                <View className="items-end">
                    <Text
                        className={`text-sm font-medium ${getStatusColor(item.isArchived)}`}
                    >
                        {item.isArchived ? "Archivé" : "Actif"}
                    </Text>
                    <Text
                        className={`text-base font-bold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                            }`}
                    >
                        {item.initialBudget.toLocaleString()} Ar
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return <Loader />;
    }

    return (
        <View className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
            <FlatList
                data={projects}
                keyExtractor={(item) => item.id}
                renderItem={renderProjectCard}
                contentContainerStyle={{ padding: 16 }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme === "dark" ? "#06b6d4" : "#0891b2"}
                    />
                }
                ListEmptyComponent={
                    <View className="items-center mt-20">
                        <MaterialIcons
                            name="folder-open"
                            size={64}
                            color={theme === "dark" ? "#4B5563" : "#9CA3AF"}
                        />
                        <Text
                            className={`text-lg mt-4 ${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            Aucun projet pour le moment
                        </Text>
                        <Pressable
                            onPress={() => router.push("/project/create")}
                            className="mt-4 bg-cyan-500 px-6 py-3 rounded-xl"
                        >
                            <Text className="text-white font-semibold">Créer un projet</Text>
                        </Pressable>
                    </View>
                }
            />
        </View>
    );
}