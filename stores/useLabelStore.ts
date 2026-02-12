import { create } from 'zustand';
import { labelAPI } from '@/services/api';
import { Alert } from 'react-native';

interface Label {
    id: string;
    name: string;
}

interface LabelStore {
    labels: Label[];
    isLoading: boolean;
    isCreating: boolean;
    isUpdating: Record<string, boolean>;
    error: string | null;

    fetchLabels: (accountId: string) => Promise<void>;
    createLabel: (accountId: string, name: string) => Promise<Label | null>;
    updateLabel: (accountId: string, id: string, name: string) => Promise<Label | null>;
    deleteLabel: (accountId: string, id: string, name: string) => Promise<void>; // ← Ajout accountId
}

const DEFAULT_LABELS = ['NOURRITURE', 'TRANSPORT', 'LOISIRS'];

export const useLabelStore = create<LabelStore>((set, get) => ({
    labels: [],
    isLoading: false,
    isCreating: false,
    isUpdating: {},
    error: null,

    fetchLabels: async (accountId: string) => {
        if (!accountId) return;

        set({ isLoading: true, error: null });

        try {
            const response = await labelAPI.getAll(accountId);
            let fetchedLabels = response.data.values || [];
            fetchedLabels = fetchedLabels.filter((l: Label) => l && l.id && l.name);

            console.log('Labels récupérés:', fetchedLabels.length);
            set({ labels: fetchedLabels, isLoading: false });


            const existingNames = fetchedLabels.map((l: Label) => l.name);
            const missingDefaults = DEFAULT_LABELS.filter(d => !existingNames.includes(d));

            console.log('Labels par défaut manquants:', missingDefaults);


            if (missingDefaults.length > 0) {
                for (const labelName of missingDefaults) {
                    try {
                        await labelAPI.create(accountId, { name: labelName });
                        console.log(`Label ${labelName} créé avec succès`);
                    } catch (error) {
                        console.error(`Erreur création ${labelName}:`, error);
                    }
                }

                const newResponse = await labelAPI.getAll(accountId);
                const newLabels = newResponse.data.values || [];
                set({ labels: newLabels });
                console.log('Labels après création des défauts:', newLabels.length);
            }
        } catch (error) {
            console.error('Erreur fetchLabels:', error);
            set({ isLoading: false, error: 'Erreur de chargement' });
        }
    },

    createLabel: async (accountId: string, name: string) => {
        if (!accountId) return null;
        if (!name.trim()) {
            Alert.alert('Erreur', 'Le nom du label est requis');
            return null;
        }

        set({ isCreating: true, error: null });

        try {
            const response = await labelAPI.create(accountId, {
                name: name.trim().toUpperCase()
            });

            console.log('Label créé:', response.data);


            set(state => ({
                labels: [response.data, ...state.labels],
                isCreating: false
            }));

            Alert.alert('Succès', 'Label créé');
            return response.data;
        } catch (error: any) {
            console.error('Erreur createLabel:', error?.response?.data || error);
            set({ isCreating: false, error: 'Erreur de création' });
            Alert.alert('Erreur', 'Impossible de créer le label');
            return null;
        }
    },

    updateLabel: async (accountId: string, id: string, name: string) => {
        if (!accountId) return null;

        set(state => ({
            isUpdating: { ...state.isUpdating, [id]: true },
            error: null
        }));

        try {
            const response = await labelAPI.update(accountId, id, {
                id,
                name: name.trim().toUpperCase()
            });

            console.log('Label modifié:', response.data);

            set(state => {
                const index = state.labels.findIndex(l => l.id === id);
                const newLabels = [...state.labels];
                if (index !== -1) newLabels[index] = response.data;

                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];

                return { labels: newLabels, isUpdating: newIsUpdating };
            });

            Alert.alert('Succès', 'Label modifié');
            return response.data;
        } catch (error) {
            console.error('Erreur updateLabel:', error);
            set(state => {
                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];
                return { isUpdating: newIsUpdating, error: 'Erreur de modification' };
            });
            Alert.alert('Erreur', 'Impossible de modifier');
            return null;
        }
    },

    deleteLabel: async (accountId: string, id: string, name: string) => {
        if (DEFAULT_LABELS.includes(name)) {
            Alert.alert('Action impossible', 'Les labels par défaut ne peuvent pas être supprimés');
            return;
        }

        Alert.alert(
            'Supprimer le label',
            `Êtes-vous sûr de vouloir supprimer "${name}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: async () => {

                        set(state => ({
                            labels: state.labels.filter(l => l.id !== id)
                        }));
                        Alert.alert('Succès', 'Label supprimé');
                    }
                }
            ]
        );
    }
}));
