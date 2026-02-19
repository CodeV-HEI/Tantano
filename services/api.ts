import {
  CreationLabel,
  CreationTransaction,
  CreationWallet,
  Label,
  LoginRequest,
  PaginatedLabels,
  PaginatedWallets,
  RegisterRequest,
  Transaction,
  TransactionType,
  UpdateWallet,
  User,
  UserWithToken,
  Wallet,
  WalletAutomaticIncome,
  WalletType,
} from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const API_URL = process.env.API_BASE_URL || 'https://tantano-api.onrender.com';

const API_URL = "http://192.168.0.29:8080";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Intercepteur pour ajouter le token JWT automatiquement
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  },
);

const apiWithRetry = async (axiosCall: any, retries = 2, delay = 3000) => {
  for (let i = 0; i <= retries; i++) {
    try {
      return await axiosCall();
    } catch (error: any) {
      if (i === retries) throw error;

      if (error.code === "ECONNABORTED") {
        console.log(
          `Tentative ${i + 1}/${retries + 1} échouée, nouvelle tentative dans ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      throw error;
    }
  }
};

export const authAPI = {
  login: (data: LoginRequest) =>
    apiWithRetry(() => api.post<UserWithToken>("/auth/sign-in", data)),

  register: (data: RegisterRequest) =>
    apiWithRetry(() => api.post<User>("/auth/sign-up", data)),

  healthCheck: () => api.get("/health"),
};

export const walletAPI = {
  getAll: (
    accountId: string,
    params?: {
      name?: string;
      isActive?: boolean;
      walletType?: WalletType;
    },
  ) =>
    apiWithRetry(() =>
      api.get<PaginatedWallets>(`/account/${accountId}/wallet`, { params }),
    ),

  getOne: (accountId: string, walletId: string) =>
    apiWithRetry(() =>
      api.get<Wallet>(`/account/${accountId}/wallet/${walletId}`),
    ),

  create: (accountId: string, data: CreationWallet) =>
    apiWithRetry(() => api.post<Wallet>(`/account/${accountId}/wallet`, data)),

  update: (accountId: string, walletId: string, data: UpdateWallet) =>
    apiWithRetry(() =>
      api.put<Wallet>(`/account/${accountId}/wallet/${walletId}`, data),
    ),

  updateAutomaticIncome: (
    accountId: string,
    walletId: string,
    data: WalletAutomaticIncome,
  ) =>
    apiWithRetry(() =>
      api.put<Wallet>(
        `/account/${accountId}/wallet/${walletId}/automaticIncome`,
        data,
      ),
    ),
};

export const transactionAPI = {
  getAll: (
    accountId: string,
    params?: {
      startingDate?: string;
      endingDate?: string;
      type?: TransactionType;
      label?: string;
      minAmount?: number;
      maxAmount?: number;
      sortBy?: "date" | "amount";
      sortOrder?: "asc" | "desc";
    },
  ) =>
    apiWithRetry(() =>
      api.get<Transaction[]>(`/account/${accountId}/transaction`, { params }),
    ),

  getOne: (accountId: string, walletId: string, transactionId: string) =>
    apiWithRetry(() =>
      api.get<Transaction>(
        `/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
      ),
    ),

  create: (accountId: string, walletId: string, data: CreationTransaction) =>
    apiWithRetry(() =>
      api.post<Transaction>(
        `/account/${accountId}/wallet/${walletId}/transaction`,
        data,
      ),
    ),

  update: (
    accountId: string,
    walletId: string,
    transactionId: string,
    data: CreationTransaction,
  ) =>
    apiWithRetry(() =>
      api.put<Transaction>(
        `/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
        data,
      ),
    ),

  delete: (accountId: string, walletId: string, transactionId: string) =>
    apiWithRetry(() =>
      api.delete(
        `/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
      ),
    ),
};

export const labelAPI = {
  getAll: (
    accountId: string,
    params?: {
      page?: number;
      pageSize?: number;
      name?: string;
    },
  ) =>
    apiWithRetry(() =>
      api.get<PaginatedLabels>(`/account/${accountId}/label`, { params }),
    ),

  getOne: (accountId: string, labelId: string) =>
    apiWithRetry(() =>
      api.get<Label>(`/account/${accountId}/label/${labelId}`),
    ),

  create: (accountId: string, data: CreationLabel) =>
    apiWithRetry(() => api.post<Label>(`/account/${accountId}/label`, data)),

  update: (accountId: string, labelId: string, data: Label) =>
    apiWithRetry(() =>
      api.put<Label>(`/account/${accountId}/label/${labelId}`, data),
    ),
};

export default api;
