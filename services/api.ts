import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    LoginRequest,
    RegisterRequest,
    UserWithToken,
    Wallet,
    CreationWallet,
    UpdateWallet,
    Transaction,
    CreationTransaction,
    Label,
    CreationLabel,
    WalletAutomaticIncome,
    PaginatedLabels,
    PaginatedWallets,
    WalletType,
    User
} from '@/types/api';

const API_URL = process.env.API_BASE_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
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
        api.post<UserWithToken>('/auth/sign-in', data),

    register: (data: RegisterRequest) =>
        api.post<User>('/auth/sign-up', data),
};

export const walletAPI = {
    // GET /account/{accountId}/wallet
    getAll: (accountId: string, params?: {
        name?: string;
        isActive?: boolean;
        walletType?: WalletType;
    }) => api.get<PaginatedWallets>(`/account/${accountId}/wallet`, { params }),

    // GET /account/{accountId}/wallet/{walletId}
    getOne: (accountId: string, walletId: string) =>
        api.get<Wallet>(`/account/${accountId}/wallet/${walletId}`),

    // POST /account/{accountId}/wallet
    create: (accountId: string, data: CreationWallet) =>
        api.post<Wallet>(`/account/${accountId}/wallet`, data),

    // PUT /account/{accountId}/wallet/{walletId}
    update: (accountId: string, walletId: string, data: UpdateWallet) =>
        api.put<Wallet>(`/account/${accountId}/wallet/${walletId}`, data),

    // PUT /account/{accountId}/wallet/{walletId}/automaticIncome
    updateAutomaticIncome: (accountId: string, walletId: string, data: WalletAutomaticIncome) =>
        api.put<Wallet>(`/account/${accountId}/wallet/${walletId}/automaticIncome`, data),
};

export const transactionAPI = {
    // GET /account/{accountId}/wallet/{walletId}/transaction
    getAll: (accountId: string, walletId: string) =>
        api.get<Transaction[]>(`/account/${accountId}/wallet/${walletId}/transaction`),

    // GET /account/{accountId}/wallet/{walletId}/transaction/{transactionId}
    getOne: (accountId: string, walletId: string, transactionId: string) =>
        api.get<Transaction>(`/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`),

    // POST /account/{accountId}/wallet/{walletId}/transaction
    create: (accountId: string, walletId: string, data: CreationTransaction) =>
        api.post<Transaction>(`/account/${accountId}/wallet/${walletId}/transaction`, data),

    // PUT /account/{accountId}/wallet/{walletId}/transaction/{transactionId}
    update: (accountId: string, walletId: string, transactionId: string, data: Transaction) =>
        api.put<Transaction>(`/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`, data),
};

export const labelAPI = {
    // GET /account/{accountId}/label
    getAll: (accountId: string, params?: {
        page?: number;
        pageSize?: number;
        name?: string;
    }) => api.get<PaginatedLabels>(`/account/${accountId}/label`, { params }),

    // GET /account/{accountId}/label/{labelId}
    getOne: (accountId: string, labelId: string) =>
        api.get<Label>(`/account/${accountId}/label/${labelId}`),

    // POST /account/{accountId}/label
    create: (accountId: string, data: CreationLabel) =>
        api.post<Label>(`/account/${accountId}/label`, data),

    // PUT /account/{accountId}/label/{labelId}
    update: (accountId: string, labelId: string, data: Label) =>
        api.put<Label>(`/account/${accountId}/label/${labelId}`, data),
};

export default api;