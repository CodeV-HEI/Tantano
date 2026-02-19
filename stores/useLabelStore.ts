import { create } from 'zustand';
import { labelAPI } from '@/services/api';
import { Alert } from 'react-native';


interface Label {
    id: string;
    name: string;
    color: string;
    iconRef?: string;
}

interface LabelWithUI extends Label {
    _isDeleting?: boolean;
    _isUpdating?: boolean;
    _isArchiving?: boolean;
}


interface PaginationInfo {
    totalPage: number;
    page: number;
    hasNext: boolean;
    hasPrev: boolean;
}

interface LabelStore {

    labels: LabelWithUI[];
    pagination: PaginationInfo | null;
    isLoading: boolean;
    isLoadingMore: boolean;
    isCreating: boolean;
    isUpdating: Record<string, boolean>;
    error: string | null;


    fetchLabels: (accountId: string, page?: number, searchName?: string) => Promise<void>;
    loadMore: (accountId: string) => Promise<void>;
    searchLabels: (accountId: string, name: string) => Promise<void>;
    createLabel: (accountId: string, name: string, color?: string, iconRef?: string) => Promise<Label | null>;
    updateLabel: (accountId: string, id: string, name: string, color?: string, iconRef?: string) => Promise<Label | null>;
    archiveLabel: (accountId: string, id: string, name: string) => Promise<void>;
    deleteLabel: (accountId: string, id: string, name: string) => Promise<void>;
}


export const DEFAULT_LABELS = [
    { name: 'NOURRITURE', color: '#FF6B6B' },
{ name: 'TRANSPORT', color: '#4ECDC4' },
{ name: 'LOISIRS', color: '#FFD93D' }
];

export const COLOR_PALETTE = [
    '#FF6B6B', // Rouge
'#4ECDC4', // Turquoise
'#FFD93D', // Jaune
'#6BCB77', // Vert
'#9D65C9', // Violet
'#FF8C42', // Orange
'#4A90E2', // Bleu
'#F38181', // Rose
'#A8E6CF', // Menthe
'#FFB347', // Pêche
'#6C5B7B', // Violet foncé
'#F9D56E'  // Moutarde
];

export const useLabelStore = create<LabelStore>((set, get) => ({

    labels: [],
    pagination: null,
    isLoading: false,
    isLoadingMore: false,
    isCreating: false,
    isUpdating: {},
    error: null,


    fetchLabels: async (accountId: string, page: number = 1, searchName?: string) => {
        if (!accountId) return;

        set({
            isLoading: page === 1,
            error: null
        });

        try {
            console.log(` Récupération page ${page} des labels...`);

            const response = await labelAPI.getAll(accountId, {
                page,
                pageSize: 20,
                name: searchName
            });

            const newLabels = response.data.values || [];
            const pagination = response.data.pagination;

            console.log(` Page ${page}: ${newLabels.length} labels reçus`);
            console.log(' Pagination:', pagination);


            const processedLabels = newLabels.map((l: any) => {
                const defaultLabel = DEFAULT_LABELS.find(d => d.name === l.name);
                return {
                    ...l,
                    color: l.color || defaultLabel?.color || COLOR_PALETTE[0]
                };
            });

            set(state => ({
                labels: page === 1 ? processedLabels : [...state.labels, ...processedLabels],
                pagination,
                isLoading: false,
                isLoadingMore: false
            }));


            if (page === 1) {
                await get().checkDefaultLabels(accountId, processedLabels);
            }
        } catch (error) {
            console.error('❌ Erreur fetchLabels:', error);
            set({
                isLoading: false,
                isLoadingMore: false,
                error: 'Erreur de chargement'
            });
        }
    },


    loadMore: async (accountId: string) => {
        const { pagination, isLoadingMore } = get();

        if (!pagination?.hasNext || isLoadingMore) return;

        set({ isLoadingMore: true });

        const nextPage = pagination.page + 1;
        await get().fetchLabels(accountId, nextPage);
    },

    searchLabels: async (accountId: string, name: string) => {
        if (!accountId) return;

        set({ isLoading: true, error: null });

        try {
            console.log(` Recherche de labels avec le nom: "${name}"`);

            const response = await labelAPI.getAll(accountId, {
                page: 1,
                pageSize: 50,
                name
            });

            const foundLabels = response.data.values || [];

            console.log(` ${foundLabels.length} labels trouvés`);


            const processedLabels = foundLabels.map((l: any) => {
                const defaultLabel = DEFAULT_LABELS.find(d => d.name === l.name);
                return {
                    ...l,
                    color: l.color || defaultLabel?.color || COLOR_PALETTE[0]
                };
            });

            set({
                labels: processedLabels,
                pagination: response.data.pagination,
                isLoading: false
            });
        } catch (error) {
            console.error(' Erreur searchLabels:', error);
            set({ isLoading: false, error: 'Erreur de recherche' });
        }
    },


    checkDefaultLabels: async (accountId: string, currentLabels: Label[]) => {
        const existingNames = currentLabels.map(l => l.name);
        const missingDefaults = DEFAULT_LABELS.filter(d => !existingNames.includes(d.name));

        if (missingDefaults.length > 0) {
            console.log(' Création des labels par défaut:',
                        missingDefaults.map(d => d.name));

            for (const defaultLabel of missingDefaults) {
                try {
                    await labelAPI.create(accountId, defaultLabel);
                    console.log(` ${defaultLabel.name} créé`);
                } catch (error) {
                    console.error(` Erreur création ${defaultLabel.name}:`, error);
                }
            }


            await get().fetchLabels(accountId, 1);
        }
    },

    createLabel: async (accountId: string, name: string, color?: string, iconRef?: string) => {
        console.log(' STORE - reçu:', { accountId, name, color });

        if (!accountId) return null;
        if (!name.trim()) {
            Alert.alert('Erreur', 'Le nom du label est requis');
            return null;
        }

        set({ isCreating: true, error: null });

        try {
            console.log(' STORE - envoi à API:', {
                name: name.trim().toUpperCase(),
                        color
            });

            const response = await labelAPI.create(accountId, {
                name: name.trim().toUpperCase(),
                                                   color: color,
                                                   iconRef: iconRef || undefined
            });


            if (color && response.data.color !== color) {
                console.log(' API a ignoré la couleur, on force:', color);
                response.data.color = color;
            }

            console.log(' STORE - réponse API (corrigée):', response.data);

            set(state => ({
                labels: [response.data, ...state.labels],
                isCreating: false
            }));

            Alert.alert('Succès', 'Label créé');
            return response.data;
        } catch (error: any) {
            console.error(' Erreur createLabel:', error?.response?.data || error);
            set({ isCreating: false, error: 'Erreur de création' });
            Alert.alert('Erreur', error?.response?.data?.message || 'Impossible de créer le label');
            return null;
        }
    },

    updateLabel: async (accountId: string, id: string, name: string, color?: string, iconRef?: string) => {
        if (!accountId) return null;

        set(state => ({
            isUpdating: { ...state.isUpdating, [id]: true },
            error: null
        }));

        try {

            const existingLabel = get().labels.find(l => l.id === id);

            const updateData: any = {
                id,
                name: name.trim().toUpperCase()
            };


            if (color && color !== existingLabel?.color) {
                updateData.color = color;
            }


            if (iconRef !== undefined && iconRef !== existingLabel?.iconRef) {
                updateData.iconRef = iconRef;
            }

            const response = await labelAPI.update(accountId, id, updateData);

            console.log(' Label modifié:', response.data);

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
        } catch (error: any) {
            console.error(' Erreur updateLabel:', error?.response?.data || error);
            set(state => {
                const newIsUpdating = { ...state.isUpdating };
                delete newIsUpdating[id];
                return { isUpdating: newIsUpdating, error: 'Erreur de modification' };
            });
            Alert.alert('Erreur', error?.response?.data?.message || 'Impossible de modifier');
            return null;
        }
    },
    // ============================================
    // ARCHIVER UN LABEL (NOUVEAU)
    // ============================================
    //  stores/useLabelStore.ts

    //  stores/useLabelStore.ts - archiveLabel

     /* =====================================================
    archiveLabel: async (accountId: string, id: string, name: string) => {
        console.log(' Tentative d\'archive:', { accountId, id, name });

        const isDefault = DEFAULT_LABELS.some(d => d.name === name);
        if (isDefault) {
            Alert.alert('Action impossible', 'Les labels par défaut ne peuvent pas être archivés');
            return;
        }

        //  Est-ce que cette alerte s'affiche ?
        Alert.alert(
            'Archiver le label',
            `Archiver "${name}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Archiver',
                    style: 'destructive',
                    onPress: async () => {
                        console.log('Confirmation archive pour:', name); // ← CE LOG

                        set(state => ({
                            labels: state.labels.map(l =>
                            l.id === id ? { ...l, _isArchiving: true } : l
                            )
                        }));

                        try {
                            console.log(' Appel API archive...'); // ← CE LOG
                            const response = await labelAPI.archive(accountId, id);
                            console.log(' Réponse API archive:', response.data); // ← CE LOG

                            set(state => ({
                                labels: state.labels.filter(l => l.id !== id)
                            }));

                            Alert.alert('Succès', 'Label archivé');
                        } catch (error: any) {
                            console.error(' Erreur archive:', error?.response?.data || error);

                            set(state => ({
                                labels: state.labels.map(l =>
                                l.id === id ? { ...l, _isArchiving: false } : l
                                )
                            }));

                            Alert.alert('Erreur', error?.response?.data?.message || "Impossible d'archiver");
                        }
                    }
                }
            ]
        );
    },

     ===================================================== */

    archiveLabel: async (accountId: string, id: string, name: string) => {
        console.log(' Tentative d\'archive:', { accountId, id, name });

        const isDefault = DEFAULT_LABELS.some(d => d.name === name);
        if (isDefault) {
            Alert.alert('Action impossible', 'Les labels par défaut ne peuvent pas être archivés');
            return;
        }

        Alert.alert(
            'Archiver le label',
            `Archiver "${name}" ?`,
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Archiver',
                    style: 'destructive',
                    onPress: async () => {
                        console.log(' Archive locale pour:', name);


                        set(state => ({
                            labels: state.labels.filter(l => l.id !== id)
                        }));

                        Alert.alert('Succès (mode dégradé)', 'Label archivé localement');

                        // Optionnel : tentatives futures de synchro
                        // try {
                        //     await labelAPI.archive(accountId, id);
                        // } catch (error) {
                        //     console.log('API non disponible, garde archive locale');
                        // }
                    }
                }
            ]
        );
    },


    deleteLabel: async (accountId: string, id: string, name: string) => {

        return get().archiveLabel(accountId, id, name);
    }
}));
