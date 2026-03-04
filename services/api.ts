import {
  CreationLabel,
  CreationProject,
  CreationProjectTransaction,
  CreationTransaction,
  CreationWallet,
  Label,
  LoginRequest,
  PaginatedLabels,
  PaginatedWallets,
  Project,
  ProjectStatistics,
  ProjectTransaction,
  RegisterRequest,
  Transaction,
  TransactionFilters,
  UpdateWallet,
  User,
  UserWithToken,
  Wallet,
  WalletAutomaticIncome,
  WalletType
} from '@/types/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = process.env.API_BASE_URL || 'https://tantano-api.onrender.com';


const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000,
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('token', token);
            
        }
        console.log(`API Request: ${config.method} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

const apiWithRetry = async (axiosCall: any, retries = 2, delay = 3000) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await axiosCall();
        } catch (error: any) {
            if (i === retries) throw error;

            if (error.code === 'ECONNABORTED') {
                console.log(`Tentative ${i + 1}/${retries + 1} échouée, nouvelle tentative dans ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                continue;
            }

            throw error;
        }
    }
};

export const authAPI = {
    login: (data: LoginRequest) =>
        apiWithRetry(() => api.post<UserWithToken>('/auth/sign-in', data)),

    register: (data: RegisterRequest) =>
        apiWithRetry(() => api.post<User>('/auth/sign-up', data)),

    healthCheck: () =>
        api.get('/health'),
};

export const walletAPI = {
    getAll: (accountId: string, params?: {
        name?: string;
        isActive?: boolean;
        walletType?: WalletType;
    }) => apiWithRetry(() => api.get<PaginatedWallets>(`/account/${accountId}/wallet`, { params })),

    getOne: (accountId: string, walletId: string) =>
        apiWithRetry(() => api.get<Wallet>(`/account/${accountId}/wallet/${walletId}`)),

    create: (accountId: string, data: CreationWallet) =>
        apiWithRetry(() => api.post<Wallet>(`/account/${accountId}/wallet`, data)),

    update: (accountId: string, walletId: string, data: UpdateWallet) =>
        apiWithRetry(() => api.put<Wallet>(`/account/${accountId}/wallet/${walletId}`, data)),

    updateAutomaticIncome: (accountId: string, walletId: string, data: WalletAutomaticIncome) =>
        apiWithRetry(() => api.put<Wallet>(`/account/${accountId}/wallet/${walletId}/automaticIncome`, data)),
};

export const transactionAPI = {
  getALLTransactions: (accountId: string, filters?: TransactionFilters) => 
    apiWithRetry(() => api.get<Transaction[]>(`/account/${accountId}/transaction`, {
        params: {
            ...filters,
        }
    })),

    

    getAll: (accountId: string, walletId: string) =>
        apiWithRetry(() => api.get<Transaction[]>(`/account/${accountId}/wallet/${walletId}/transaction`)),

    getOne: (accountId: string, walletId: string, transactionId: string) =>
        apiWithRetry(() => api.get<Transaction>(`/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`)),

    create: (accountId: string, walletId: string, data: CreationTransaction) =>
        apiWithRetry(() => api.post<Transaction>(`/account/${accountId}/wallet/${walletId}/transaction`, data)),

    update: (accountId: string, walletId: string, transactionId: string, data: Transaction) =>
        apiWithRetry(() => api.put<Transaction>(`/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`, data)),
};

export const labelAPI = {
    getAll: (accountId: string, params?: {
        page?: number;
        pageSize?: number;
        name?: string;
    }) => apiWithRetry(() => api.get<PaginatedLabels>(`/account/${accountId}/label`, { params })),

    getOne: (accountId: string, labelId: string) =>
        apiWithRetry(() => api.get<Label>(`/account/${accountId}/label/${labelId}`)),

    create: (accountId: string, data: CreationLabel) =>
        apiWithRetry(() => api.post<Label>(`/account/${accountId}/label`, data)),

    update: (accountId: string, labelId: string, data: Label) =>
        apiWithRetry(() => api.put<Label>(`/account/${accountId}/label/${labelId}`, data)),
};

export const projectAPI = {
  getAll: (accountId: string) =>
    apiWithRetry(() => api.get<Project[]>(`/account/${accountId}/project`)),

  getOne: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.get<Project>(`/account/${accountId}/project/${projectId}`)),

  create: (accountId: string, data: CreationProject) =>
    apiWithRetry(() => api.post<Project>(`/account/${accountId}/project`, data)),

  update: (accountId: string, projectId: string, data: CreationProject) =>
    apiWithRetry(() => api.put<Project>(`/account/${accountId}/project/${projectId}`, data)),

  delete: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.delete<Project>(`/account/${accountId}/project/${projectId}`)),

  archive: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.post<Project>(`/account/${accountId}/project/${projectId}/archive`)),

  // Transactions du projet
  getAllTransactions: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.get<ProjectTransaction[]>(`/account/${accountId}/project/${projectId}/transaction`)),

  createTransaction: (accountId: string, projectId: string, data: CreationProjectTransaction) =>
    apiWithRetry(() => api.post<ProjectTransaction>(`/account/${accountId}/project/${projectId}/transaction`, data)),

  updateTransaction: (accountId: string, projectId: string, transactionId: string, data: CreationProjectTransaction) =>
    apiWithRetry(() => api.put<ProjectTransaction>(`/account/${accountId}/project/${projectId}/transaction/${transactionId}`, data)),

  deleteTransaction: (accountId: string, projectId: string, transactionId: string) =>
    apiWithRetry(() => api.delete<ProjectTransaction>(`/account/${accountId}/project/${projectId}/transaction/${transactionId}`)),

  getStatistics: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.get<ProjectStatistics>(`/account/${accountId}/project/${projectId}/statistics`)),

   // PDF Downloads
  downloadStatisticsPDF: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.get(`/account/${accountId}/project/${projectId}/pdf/statistics`, { responseType: 'blob' })),

  downloadInvoicePDF: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.get(`/account/${accountId}/project/${projectId}/pdf/invoice`, { responseType: 'blob' })),

  downloadSummaryPDF: (accountId: string, projectId: string) =>
    apiWithRetry(() => api.get(`/account/${accountId}/project/${projectId}/pdf/summary`, { responseType: 'blob' })),
};

export type CurrencyRates = {
  [key: string]: number;
};

export type ExchangeApiResponse = {
  result: string;
  base_code: string;
  rates: CurrencyRates;
};

export type Currency = {
  label: string;
  value: string;
  rate: number;
};

const BASE_URL = "https://open.er-api.com/v6/latest";

export const getCurrencies = async (
  base: string = "MGA"
): Promise<Currency[]> => {
  try {
    const response = await fetch(`${BASE_URL}/${base}`);
    const data: ExchangeApiResponse = await response.json();

    if (!data.rates) {
      throw new Error("Erreur récupération devises");
    }

    const currencies: Currency[] = Object.keys(data.rates).map((code) => ({
      label: code,
      value: code,
      rate: data.rates[code],
    }));

    console.log("Devises récupérées:", currencies);

    return currencies;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default api;