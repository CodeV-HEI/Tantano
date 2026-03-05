import Background from "@/components/Background";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { projectAPI } from "@/services/api";
import { CreationProject, Project } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import Toast from "react-native-toast-message";

const EMOJI_OPTIONS = ["🚀", "📱", "📈", "🎨", "💼", "🏠", "💡", "🛠️"];
const COLOR_OPTIONS = ["#3B82F6", "#F59E0B", "#EC4899", "#10B981", "#6366F1", "#8B5CF6"];

const ProjectCard = ({ project, theme, onShowOptions }: {
    project: Project;
    theme: string;
    onShowOptions: (projectId: string) => void;
}) => {
    const router = useRouter();

    return (
        <View className="mb-4">
            <TouchableOpacity
                onPress={() =>
                    router.push({
                        pathname: "/project/[projectId]",
                        params: { projectId: project.id },
                    })
                }
                activeOpacity={0.7}
            >
                <Animated.View
                    entering={FadeInUp.duration(600)}
                    className={`relative rounded-2xl p-4 border-l-8 ${project.isArchived
                        ? theme === "dark"
                            ? "bg-gray-900/30 opacity-50"
                            : "bg-gray-100/50 opacity-50"
                        : theme === "dark"
                            ? "bg-gray-900/50"
                            : "bg-cyan-50/50"
                        }`}
                    style={{ borderLeftColor: project.color || "#06b6d4" }}
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center flex-1">
                            {project.iconRef && (
                                <Text style={{ fontSize: 24, marginRight: 8 }}>
                                    {project.iconRef}
                                </Text>
                            )}
                            <View className="flex-1">
                                <View className="flex-row items-center">
                                    <Text
                                        className={`text-lg font-bold flex-1 ${theme === "dark"
                                            ? "text-white"
                                            : "text-cyan-800"
                                            }`}
                                    >
                                        {project.name}
                                    </Text>
                                </View>
                                {project.isArchived && (
                                    <View className="flex-row items-center mt-1">
                                        <View className="bg-orange-500 rounded-full px-2 py-1">
                                            <Text className="text-white text-xs font-semibold">
                                                Archivé
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => onShowOptions(project.id)}
                            style={{ padding: 10, zIndex: 10 }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialIcons
                                name="more-vert"
                                size={24}
                                color={theme === "dark" ? "white" : "black"}
                            />
                        </TouchableOpacity>
                    </View>

                    {project.description && (
                        <Text
                            className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                } text-sm mb-2`}
                        >
                            {project.description}
                        </Text>
                    )}
                    <View className="flex-row justify-end items-center">
                        <Text
                            className={`${theme === "dark" ? "text-cyan-400" : "text-cyan-600"
                                } font-medium text-sm`}
                        >
                            Budget: {project.initialBudget.toLocaleString()} Ar
                        </Text>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );
};

export default function ProjectsScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { user } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();

    const [projects, setProjects] = useState<Project[]>([]);
    const [isAddProjectModalVisible, setIsAddProjectModalVisible] = useState(false);
    const [newProject, setNewProject] = useState<CreationProject>({
        name: "",
        description: "",
        initialBudget: 0,
        color: COLOR_OPTIONS[0],
        iconRef: EMOJI_OPTIONS[0],
    });
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        setIsRefreshing(true);
        try {
            if (!user?.id) {
                setProjects([]);
                return;
            }
            const response = await projectAPI.getAll(user.id);
            setProjects(response.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            Toast.show({
                type: "error",
                text1: "Erreur de chargement",
                text2: "Impossible de récupérer vos projets.",
            });
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleShowOptionsMenu = (projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        if (!project) return;

        setSelectedProjectId(projectId);

        const options = [
            "Modifier",
            project.isArchived ? "Désarchiver" : "Archiver",
            "Supprimer",
            "Annuler",
        ];
        const destructiveButtonIndex = 2;
        const cancelButtonIndex = 3;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
                title: project.name,
                titleTextStyle: { color: theme === "dark" ? "#fff" : "#000" },
                textStyle: { color: theme === "dark" ? "#fff" : "#000" },
                containerStyle: { backgroundColor: theme === "dark" ? "#1f2937" : "#fff" },
            },
            (buttonIndex: number | undefined) => {
                if (buttonIndex === 0) {
                    // Modifier → naviguer vers le détail
                    router.push({
                        pathname: "/project/[projectId]",
                        params: { projectId: projectId },
                    });
                }
                if (buttonIndex === 1) {
                    handleArchiveProject(projectId);
                }
                if (buttonIndex === 2) {
                    handleDeleteProject(projectId);
                }
            }
        );
    };

    const handleArchiveProject = async (projectId: string) => {
        if (!user?.id) return;
        setLoading(true);
        try {
            await projectAPI.archive(user.id, projectId);
            const project = projects.find(p => p.id === projectId);
            Toast.show({
                type: "success",
                text1: project?.isArchived ? "Projet désarchivé" : "Projet archivé",
                text2: project?.isArchived
                    ? "Le projet est à nouveau actif."
                    : "Le projet a été archivé.",
            });
            fetchProjects();
        } catch (error) {
            console.error("Failed to archive/unarchive project", error);
            Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de modifier le statut." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = async (projectId: string) => {
        if (!user?.id) return;

        Toast.show({
            type: "info",
            text1: "Suppression en cours...",
        });

        setLoading(true);
        try {
            await projectAPI.delete(user.id, projectId);
            Toast.show({
                type: "success",
                text1: "Projet supprimé",
                text2: "Le projet a été supprimé définitivement.",
            });
            fetchProjects();
        } catch (error) {
            console.error("Failed to delete project", error);
            Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de supprimer le projet." });
        } finally {
            setLoading(false);
        }
    };

    const handleAddProject = async () => {
        if (!newProject.name || newProject.initialBudget <= 0) {
            Toast.show({
                type: "error",
                text1: "Champs manquants",
                text2: "Veuillez remplir le nom et le budget.",
            });
            return;
        }
        if (!user?.id) return;

        setLoading(true);
        try {
            await projectAPI.create(user.id, newProject);
            Toast.show({ type: "success", text1: "Projet créé", text2: "Votre projet a été ajouté !" });
            setIsAddProjectModalVisible(false);
            setNewProject({
                name: "",
                description: "",
                initialBudget: 0,
                color: COLOR_OPTIONS[0],
                iconRef: EMOJI_OPTIONS[0],
            });
            fetchProjects();
        } catch (error) {
            console.error("Failed to add project", error);
            Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de créer le projet." });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        StatusBar.setBarStyle(theme === "dark" ? "light-content" : "dark-content");
    }, [theme]);

    return (
        <View className="flex-1 bg-white dark:bg-black">
            <Background />

            <View
                className={`absolute top-10 -left-20 w-80 h-80 ${theme === "dark" ? "bg-purple-500" : "bg-purple-300"
                    } rounded-full opacity-10 blur-3xl`}
            />
            <View
                className={`absolute bottom-40 -right-20 w-80 h-80 ${theme === "dark" ? "bg-cyan-500" : "bg-cyan-300"
                    } rounded-full opacity-10 blur-3xl`}
            />

            <View className="flex-row justify-between items-center pt-16 px-4 pb-4">
                <Text
                    className={`text-3xl font-bold ${theme === "dark" ? "text-white" : "text-black"
                        }`}
                >
                    Mes Projets
                </Text>
                <TouchableOpacity
                    onPress={() => setIsAddProjectModalVisible(true)}
                    className="w-12 h-12 items-center justify-center rounded-full bg-blue-500"
                >
                    <MaterialIcons name="add" size={28} color="white" />
                </TouchableOpacity>
            </View>

            {loading && projects.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#06b6d4" />
                </View>
            ) : (
                <FlatList
                    data={projects}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <ProjectCard
                            project={item}
                            theme={theme}
                            onShowOptions={handleShowOptionsMenu}
                        />
                    )}
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={fetchProjects} />
                    }
                    ListEmptyComponent={
                        <View className="flex-1 justify-center items-center mt-20">
                            <Text
                                className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"
                                    } text-lg`}
                            >
                                Aucun projet. Créez-en un !
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Modal Ajouter Projet */}
            <Modal
                visible={isAddProjectModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsAddProjectModalVisible(false)}
            >
                <View className="flex-1 justify-end bg-black/50">
                    <View
                        className={`h-[90%] rounded-t-3xl p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"
                            }`}
                    >
                        <View className="flex-row justify-between items-center mb-6">
                            <Text
                                className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Nouveau Projet
                            </Text>
                            <TouchableOpacity onPress={() => setIsAddProjectModalVisible(false)}>
                                <MaterialIcons
                                    name="close"
                                    size={28}
                                    color={theme === "dark" ? "white" : "black"}
                                />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text
                                className={`text-base font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                    }`}
                            >
                                Icône
                            </Text>
                            <View className="flex-row flex-wrap justify-center bg-gray-100 dark:bg-gray-800 rounded-xl p-2 mb-4">
                                {EMOJI_OPTIONS.map((emoji) => (
                                    <TouchableOpacity
                                        key={emoji}
                                        onPress={() => setNewProject({ ...newProject, iconRef: emoji })}
                                        className={`m-1 p-2 rounded-lg ${newProject.iconRef === emoji ? "bg-blue-500" : ""
                                            }`}
                                    >
                                        <Text style={{ fontSize: 24 }}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text
                                className={`text-base font-semibold mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-600"
                                    }`}
                            >
                                Couleur
                            </Text>
                            <View className="flex-row flex-wrap justify-center bg-gray-100 dark:bg-gray-800 rounded-xl p-2 mb-4">
                                {COLOR_OPTIONS.map((color) => (
                                    <TouchableOpacity
                                        key={color}
                                        onPress={() => setNewProject({ ...newProject, color })}
                                        className={`m-1 w-10 h-10 rounded-full border-2 ${newProject.color === color
                                            ? "border-blue-500"
                                            : "border-transparent"
                                            }`}
                                    >
                                        <View
                                            className="flex-1 rounded-full"
                                            style={{ backgroundColor: color }}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <TextInput
                                placeholder="Nom du projet"
                                placeholderTextColor="#9ca3af"
                                value={newProject.name}
                                onChangeText={(text) =>
                                    setNewProject({ ...newProject, name: text })
                                }
                                className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-900"
                                    }`}
                            />
                            <TextInput
                                placeholder="Description"
                                placeholderTextColor="#9ca3af"
                                value={newProject.description}
                                onChangeText={(text) =>
                                    setNewProject({ ...newProject, description: text })
                                }
                                className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-900"
                                    }`}
                                multiline
                            />
                            <TextInput
                                placeholder="Budget initial"
                                placeholderTextColor="#9ca3af"
                                value={
                                    newProject.initialBudget === 0
                                        ? ""
                                        : newProject.initialBudget.toString()
                                }
                                onChangeText={(text) =>
                                    setNewProject({
                                        ...newProject,
                                        initialBudget:
                                            text === "" ? 0 : parseFloat(text.replace(/[^0-9.]/g, "")) || 0,
                                    })
                                }
                                keyboardType="numeric"
                                className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark"
                                    ? "bg-gray-800 text-white"
                                    : "bg-gray-100 text-gray-900"
                                    }`}
                            />
                        </ScrollView>

                        <TouchableOpacity
                            onPress={handleAddProject}
                            disabled={loading}
                            className={`py-4 rounded-xl items-center mt-4 ${loading ? "bg-gray-500" : "bg-blue-500"
                                }`}
                        >
                            <Text className="text-white font-bold text-lg">
                                {loading ? "Création..." : "Créer le Projet"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}