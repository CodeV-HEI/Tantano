import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LoginRequest,
    RegisterRequest,
    UserWithApiKey,
    Wallet,
    WalletMinimalInfo,
    Transaction,
    TransactionMinimalInfo,
    Label,
    LabelMinimalInfo
} from '@/types/api';

const API_URL = process.env.API_BASE_URL || 'https://tantano-api.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter l'API key automatiquement
api.interceptors.request.use(
    async (config) => {
        const apiKey = await AsyncStorage.getItem('apiKey');
        if (apiKey) {
            config.headers['x-api-key'] = apiKey;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Fonction pour gérer les erreurs
const handleApiError = (error: any) => {
    if (error.response) {
        throw new Error(error.response.data?.message || 'Une erreur est survenue');
    } else if (error.request) {
        throw new Error('Impossible de contacter le serveur');
    } else {
        throw new Error('Erreur de configuration de la requête');
    }
};

export const authAPI = {
    login: (data: LoginRequest) =>
        api.post<UserWithApiKey>('/login', data),

    register: (data: RegisterRequest) =>
        api.post<UserWithApiKey>('/register', data),

    healthCheck: (to: string) =>
        api.get(`/health/email?to=${encodeURIComponent(to)}`),

    ping: () => api.get<string>('/ping'),
};

export const walletAPI = {
    getAll: () => api.get<Wallet[]>('/wallet'),

    create: (wallets: WalletMinimalInfo[]) =>
        api.post<Wallet[]>('/wallet', wallets),

    // Note: L'API n'a pas d'endpoint pour update/delete, mais nous les ajoutons pour la complétude
    update: (id: string, wallet: Partial<WalletMinimalInfo>) =>
        api.put<Wallet>(`/wallet/${id}`, wallet).catch(handleApiError),

    delete: (id: string) =>
        api.delete(`/wallet/${id}`).catch(handleApiError),
};

export const transactionAPI = {
    getAll: () => api.get<Transaction[]>('/transaction'),

    create: (transactions: TransactionMinimalInfo[]) =>
        api.post<Transaction[]>('/transaction', transactions),

    // Note: L'API n'a pas d'endpoint pour update/delete, mais nous les ajoutons pour la complétude
    update: (id: string, transaction: Partial<TransactionMinimalInfo>) =>
        api.put<Transaction>(`/transaction/${id}`, transaction).catch(handleApiError),

    delete: (id: string) =>
        api.delete(`/transaction/${id}`).catch(handleApiError),
};

export const labelAPI = {
    getAll: () => api.get<Label[]>('/label'),

    create: (labels: LabelMinimalInfo[]) =>
        api.post<Label[]>('/label', labels),

    // Note: L'API n'a pas d'endpoint pour update/delete, mais nous les ajoutons pour la complétude
    update: (id: string, label: Partial<LabelMinimalInfo>) =>
        api.put<Label>(`/label/${id}`, label).catch(handleApiError),

    delete: (id: string) =>
        api.delete(`/label/${id}`).catch(handleApiError),
};

export default api;