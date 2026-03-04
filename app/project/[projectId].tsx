import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { projectAPI } from "@/services/api";
import { CreationProject, CreationProjectTransaction, Project, ProjectStatistics, ProjectTransaction } from "@/types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";

const TransactionCard = ({ transaction, theme, onEdit, onDelete }: {
    transaction: ProjectTransaction;
    theme: string;
    onEdit: (transaction: ProjectTransaction) => void;
    onDelete: (transactionId: string) => void;
}) => (
    <View className={`flex-row justify-between items-center p-3 mb-2 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
        <View className="flex-1">
            <Text className={`text-base font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{transaction.name}</Text>
            {transaction.description && (
                <Text className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{transaction.description}</Text>
            )}
            <Text className={`text-sm ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>Coût estimé: ${transaction.estimatedCost.toLocaleString()}</Text>
            {transaction.realCost !== undefined && (
                <Text className={`text-sm ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>Coût réel: ${transaction.realCost.toLocaleString()}</Text>
            )}
        </View>
        <View className="flex-row">
            <TouchableOpacity onPress={() => onEdit(transaction)} className="p-2">
                <MaterialIcons name="edit" size={20} color={theme === "dark" ? "#06b6d4" : "#0891b2"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(transaction.id)} className="p-2 ml-2">
                <MaterialIcons name="delete" size={20} color="#EF4444" />
            </TouchableOpacity>
        </View>
    </View>
);

export default function ProjectDetailScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const { projectId } = useLocalSearchParams();
    const { user } = useAuth();
    const { showActionSheetWithOptions } = useActionSheet();

    const [project, setProject] = useState<Project | null>(null);
    const [statistics, setStatistics] = useState<ProjectStatistics | null>(null);
    const [transactions, setTransactions] = useState<ProjectTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditProjectModalVisible, setIsEditProjectModalVisible] = useState(false);
    const [isAddTransactionModalVisible, setIsAddTransactionModalVisible] = useState(false);
    const [isEditTransactionModalVisible, setIsEditTransactionModalVisible] = useState(false);
    const [currentTransaction, setCurrentTransaction] = useState<CreationProjectTransaction & { id?: string }>({ name: '', estimatedCost: 0 });
    const [editedProject, setEditedProject] = useState<CreationProject | null>(null);
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false);

    const accountId = user?.id;

    const fetchProjectDetails = useCallback(async () => {
        if (!accountId || !projectId) return;
        setLoading(true);
        try {
            const projectResponse = await projectAPI.getOne(accountId, projectId as string);
            setProject(projectResponse.data);
            setEditedProject(projectResponse.data);

            const statsResponse = await projectAPI.getStatistics(accountId, projectId as string);
            setStatistics(statsResponse.data);

            const transactionsResponse = await projectAPI.getAllTransactions(accountId, projectId as string);
            setTransactions(transactionsResponse.data);
        } catch (error) {
            console.error("Failed to fetch project details", error);
            Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de charger le projet." });
            router.back();
        } finally {
            setLoading(false);
        }
    }, [accountId, projectId, router]);

    useEffect(() => {
        fetchProjectDetails();
    }, [fetchProjectDetails]);

    const showProjectOptionsMenu = () => {
        if (!project) return;

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
                    // Modifier
                    setIsEditProjectModalVisible(true);
                }
                if (buttonIndex === 1) {
                    // Archiver/Désarchiver
                    handleArchiveProject();
                }
                if (buttonIndex === 2) {
                    // Supprimer
                    handleDeleteProject();
                }
            }
        );
    };

    const handleArchiveProject = async () => {
        if (!accountId || !projectId) return;
        setLoading(true);
        try {
            await projectAPI.archive(accountId, projectId as string);
            Toast.show({
                type: "success",
                text1: project?.isArchived ? "Projet désarchivé" : "Projet archivé",
                text2: project?.isArchived ? "Le projet est à nouveau actif." : "Le projet a été archivé.",
            });
            fetchProjectDetails();
        } catch (error) {
            console.error("Failed to archive project", error);
            Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de modifier le statut." });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProject = () => {
        if (!accountId || !projectId) return;
        
        Toast.show({
            type: "info",
            text1: "Suppression en cours...",
        });

        (async () => {
            setLoading(true);
            try {
                await projectAPI.delete(accountId, projectId as string);
                Toast.show({
                    type: "success",
                    text1: "Projet supprimé",
                    text2: "Le projet a été supprimé définitivement.",
                });
                router.replace("/projects");
            } catch (error) {
                console.error("Failed to delete project", error);
                Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de supprimer le projet." });
            } finally {
                setLoading(false);
            }
        })();
    };

    const handleUpdateProject = async () => {
        if (!accountId || !projectId || !editedProject) return;
        if (!editedProject.name || editedProject.initialBudget <= 0) {
            Toast.show({ type: "error", text1: "Champs manquants", text2: "Veuillez remplir le nom et le budget." });
            return;
        }
        setLoading(true);
        try {
            await projectAPI.update(accountId, projectId as string, editedProject);
            Toast.show({ type: "success", text1: "Projet mis à jour" });
            setIsEditProjectModalVisible(false);
            fetchProjectDetails();
        } catch (error) {
            console.error("Failed to update project", error);
            Toast.show({ type: "error", text1: "Erreur", text2: "Impossible de mettre à jour le projet." });
        } finally {
            setLoading(false);
        }
    };

    const handleAddTransaction = async () => {
        if (!accountId || !projectId) return;
        if (!currentTransaction.name || currentTransaction.estimatedCost <= 0) {
            Toast.show({ type: "error", text1: "Champs manquants" });
            return;
        }
        setLoading(true);
        try {
            await projectAPI.createTransaction(accountId, projectId as string, currentTransaction);
            setIsAddTransactionModalVisible(false);
            setCurrentTransaction({ name: '', estimatedCost: 0 });
            fetchProjectDetails();
        } catch (error) {
            console.error("Failed to add transaction", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditTransaction = async () => {
        if (!accountId || !projectId || !currentTransaction.id) return;
        if (!currentTransaction.name || currentTransaction.estimatedCost <= 0) {
            Toast.show({ type: "error", text1: "Champs manquants" });
            return;
        }
        setLoading(true);
        try {
            await projectAPI.updateTransaction(accountId, projectId as string, currentTransaction.id, currentTransaction);
            setIsEditTransactionModalVisible(false);
            setCurrentTransaction({ name: '', estimatedCost: 0 });
            fetchProjectDetails();
        } catch (error) {
            console.error("Failed to update transaction", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransaction = (transactionId: string) => {
        if (!accountId || !projectId) return;
        setLoading(true);
        (async () => {
            try {
                await projectAPI.deleteTransaction(accountId, projectId as string, transactionId);
                Toast.show({ type: "success", text1: "Transaction supprimée" });
                fetchProjectDetails();
            } catch (error) {
                console.error("Failed to delete transaction", error);
            } finally {
                setLoading(false);
            }
        })();
    };

    const handleEditTransactionOpen = (transaction: ProjectTransaction) => {
        setCurrentTransaction({
            id: transaction.id,
            name: transaction.name,
            description: transaction.description,
            estimatedCost: transaction.estimatedCost,
            realCost: transaction.realCost,
        });
        setIsEditTransactionModalVisible(true);
    };

    const downloadPDF = async (type: 'statistics' | 'invoice' | 'summary') => {
        if (!accountId || !projectId) return;
        
        setIsDownloadingPDF(true);
        try {
            let response;
            switch (type) {
                case 'statistics':
                    response = await projectAPI.downloadStatisticsPDF(accountId, projectId as string);
                    break;
                case 'invoice':
                    response = await projectAPI.downloadInvoicePDF(accountId, projectId as string);
                    break;
                case 'summary':
                    response = await projectAPI.downloadSummaryPDF(accountId, projectId as string);
                    break;
            }

            // Créer un blob et le télécharger
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${project?.name}-${type}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            Toast.show({
                type: "success",
                text1: "PDF téléchargé",
                text2: `Le PDF ${type} a été téléchargé avec succès.`,
            });
        } catch (error) {
            console.error(`Failed to download ${type} PDF`, error);
            Toast.show({
                type: "error",
                text1: "Erreur",
                text2: `Impossible de télécharger le PDF ${type}.`,
            });
        } finally {
            setIsDownloadingPDF(false);
        }
    };

    if (loading && !project) {
        return (
            <View className={`flex-1 justify-center items-center ${theme === "dark" ? "bg-black" : "bg-white"}`}>
                <ActivityIndicator size="large" color="#06b6d4" />
            </View>
        );
    }

    if (!project) return null;

    return (
        <View className={`flex-1 ${theme === "dark" ? "bg-black" : "bg-white"}`}>
            <StatusBar barStyle={theme === "dark" ? "light-content" : "dark-content"} />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Project Header */}
                <View className={`p-6 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} border-b ${theme === "dark" ? "border-gray-800" : "border-gray-200"}`}>
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="flex-row items-center flex-1">
                            {project.iconRef && <Text style={{ fontSize: 32, marginRight: 12 }}>{project.iconRef}</Text>}
                            <View className="flex-1">
                                <Text className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{project.name}</Text>
                                {project.isArchived && (
                                    <View className="flex-row items-center mt-2">
                                        <View className="bg-orange-500 rounded-full px-3 py-1">
                                            <Text className="text-white text-xs font-semibold">Archivé</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </View>
                        
                        {/* Bouton Options */}
                        <TouchableOpacity
                            onPress={showProjectOptionsMenu}
                            style={{ padding: 10, zIndex: 10 }}
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MaterialIcons name="more-vert" size={28} color={theme === "dark" ? "white" : "black"} />
                        </TouchableOpacity>
                    </View>

                    {project.description && (
                        <Text className={`text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"} mb-4`}>{project.description}</Text>
                    )}

                    <View className={`p-4 rounded-xl ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
                        <View className="flex-row justify-between mb-3">
                            <Text className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Budget initial</Text>
                            <Text className={`font-bold ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}>${project.initialBudget.toLocaleString()}</Text>
                        </View>
                        {statistics && (
                            <>
                                <View className="flex-row justify-between mb-3">
                                    <Text className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Coût estimé</Text>
                                    <Text className={`font-bold ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`}>${statistics.totalEstimatedCost.toLocaleString()}</Text>
                                </View>
                                <View className="flex-row justify-between">
                                    <Text className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Budget restant</Text>
                                    <Text className={`font-bold ${statistics.remainingBudget >= 0 ? "text-green-500" : "text-red-500"}`}>${statistics.remainingBudget.toLocaleString()}</Text>
                                </View>
                                 <View className="flex-row justify-between mt-3">
                                    <Text className={`${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Nombre de Transactions</Text>
                                    <Text className={`font-bold ${statistics.remainingBudget >= 0 ? "text-green-500" : "text-red-500"}`}>{transactions.length}</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {/* PDF Download Buttons */}
                    <View className="mt-4 gap-2">
                        <TouchableOpacity
                            onPress={() => downloadPDF('statistics')}
                            disabled={isDownloadingPDF}
                            className={`flex-row items-center justify-center py-3 rounded-lg ${isDownloadingPDF ? "bg-gray-500" : "bg-blue-500"}`}
                        >
                            <MaterialIcons name="download" size={20} color="white" />
                            <Text className="text-white font-semibold ml-2">Télécharger Statistiques</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => downloadPDF('invoice')}
                            disabled={isDownloadingPDF}
                            className={`flex-row items-center justify-center py-3 rounded-lg ${isDownloadingPDF ? "bg-gray-500" : "bg-green-500"}`}
                        >
                            <MaterialIcons name="download" size={20} color="white" />
                            <Text className="text-white font-semibold ml-2">Télécharger Facture</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => downloadPDF('summary')}
                            disabled={isDownloadingPDF}
                            className={`flex-row items-center justify-center py-3 rounded-lg ${isDownloadingPDF ? "bg-gray-500" : "bg-purple-500"}`}
                        >
                            <MaterialIcons name="download" size={20} color="white" />
                            <Text className="text-white font-semibold ml-2">Télécharger Résumé</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Transactions Section */}
                <View className="p-6">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Transactions ({transactions.length})</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setCurrentTransaction({ name: '', estimatedCost: 0 });
                                setIsAddTransactionModalVisible(true);
                            }}
                            className="p-2 bg-blue-500 rounded-lg"
                        >
                            <MaterialIcons name="add" size={20} color="white" />
                        </TouchableOpacity>
                    </View>

                    {transactions.length === 0 ? (
                        <Text className={`text-center py-8 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Aucune transaction</Text>
                    ) : (
                        transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                theme={theme}
                                onEdit={handleEditTransactionOpen}
                                onDelete={handleDeleteTransaction}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Edit Project Modal */}
            <Modal visible={isEditProjectModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsEditProjectModalVisible(false)}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className={`h-[90%] rounded-t-3xl p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Modifier le Projet</Text>
                            <TouchableOpacity onPress={() => setIsEditProjectModalVisible(false)}>
                                <MaterialIcons name="close" size={28} color={theme === "dark" ? "white" : "black"} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput placeholder="Nom" placeholderTextColor="#9ca3af" value={editedProject?.name} onChangeText={(text) => editedProject && setEditedProject({ ...editedProject, name: text })} className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} />
                            <TextInput placeholder="Description" placeholderTextColor="#9ca3af" value={editedProject?.description} onChangeText={(text) => editedProject && setEditedProject({ ...editedProject, description: text })} className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} multiline />
                            <TextInput placeholder="Budget" placeholderTextColor="#9ca3af" value={editedProject?.initialBudget === 0 ? "" : editedProject?.initialBudget.toString()} onChangeText={(text) => editedProject && setEditedProject({ ...editedProject, initialBudget: text === "" ? 0 : parseFloat(text.replace(/[^0-9.]/g, "")) || 0 })} keyboardType="numeric" className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} />
                        </ScrollView>

                        <TouchableOpacity onPress={handleUpdateProject} disabled={loading} className={`py-4 rounded-xl items-center mt-4 ${loading ? "bg-gray-500" : "bg-blue-500"}`}>
                            <Text className="text-white font-bold text-lg">{loading ? "Mise à jour..." : "Sauvegarder"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add Transaction Modal */}
            <Modal visible={isAddTransactionModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsAddTransactionModalVisible(false)}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className={`h-[90%] rounded-t-3xl p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Nouvelle Transaction</Text>
                            <TouchableOpacity onPress={() => setIsAddTransactionModalVisible(false)}>
                                <MaterialIcons name="close" size={28} color={theme === "dark" ? "white" : "black"} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput placeholder="Nom" placeholderTextColor="#9ca3af" value={currentTransaction.name} onChangeText={(text) => setCurrentTransaction({ ...currentTransaction, name: text })} className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} />
                            <TextInput placeholder="Description" placeholderTextColor="#9ca3af" value={currentTransaction.description} onChangeText={(text) => setCurrentTransaction({ ...currentTransaction, description: text })} className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} multiline />
                            <TextInput placeholder="Coût estimé" placeholderTextColor="#9ca3af" value={currentTransaction.estimatedCost === 0 ? "" : currentTransaction.estimatedCost.toString()} onChangeText={(text) => setCurrentTransaction({ ...currentTransaction, estimatedCost: text === "" ? 0 : parseFloat(text.replace(/[^0-9.]/g, "")) || 0 })} keyboardType="numeric" className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} />
                        </ScrollView>

                        <TouchableOpacity onPress={handleAddTransaction} disabled={loading} className={`py-4 rounded-xl items-center mt-4 ${loading ? "bg-gray-500" : "bg-blue-500"}`}>
                            <Text className="text-white font-bold text-lg">{loading ? "Ajout..." : "Ajouter Transaction"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Edit Transaction Modal */}
            <Modal visible={isEditTransactionModalVisible} animationType="slide" transparent={true} onRequestClose={() => setIsEditTransactionModalVisible(false)}>
                <View className="flex-1 justify-end bg-black/50">
                    <View className={`h-[90%] rounded-t-3xl p-6 ${theme === "dark" ? "bg-gray-900" : "bg-white"}`}>
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Modifier Transaction</Text>
                            <TouchableOpacity onPress={() => setIsEditTransactionModalVisible(false)}>
                                <MaterialIcons name="close" size={28} color={theme === "dark" ? "white" : "black"} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            <TextInput placeholder="Nom" placeholderTextColor="#9ca3af" value={currentTransaction.name} onChangeText={(text) => setCurrentTransaction({ ...currentTransaction, name: text })} className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} />
                            <TextInput placeholder="Description" placeholderTextColor="#9ca3af" value={currentTransaction.description} onChangeText={(text) => setCurrentTransaction({ ...currentTransaction, description: text })} className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} multiline />
                            <TextInput placeholder="Coût estimé" placeholderTextColor="#9ca3af" value={currentTransaction.estimatedCost === 0 ? "" : currentTransaction.estimatedCost.toString()} onChangeText={(text) => setCurrentTransaction({ ...currentTransaction, estimatedCost: text === "" ? 0 : parseFloat(text.replace(/[^0-9.]/g, "")) || 0 })} keyboardType="numeric" className={`px-4 py-3 rounded-xl mb-4 text-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"}`} />
                        </ScrollView>

                        <TouchableOpacity onPress={handleEditTransaction} disabled={loading} className={`py-4 rounded-xl items-center mt-4 ${loading ? "bg-gray-500" : "bg-blue-500"}`}>
                            <Text className="text-white font-bold text-lg">{loading ? "Mise à jour..." : "Mettre à jour"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
