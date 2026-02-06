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
    UpdateWallet,
    User,
    UserWithToken,
    Wallet,
    WalletAutomaticIncome,
    WalletType,
} from "@/types/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "https://tantano-api.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 60000,
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

const handleApiError = (error: any) => {
  console.error("API Error:", error);

  if (error.code === "ECONNABORTED") {
    throw new Error(
      "Le serveur met trop de temps à répondre. Le service gratuit peut prendre jusqu'à 30 secondes pour démarrer.",
    );
  } else if (error.response) {
    throw new Error(
      error.response.data?.message ||
        `Erreur serveur: ${error.response.status}`,
    );
  } else if (error.request) {
    throw new Error(
      "Impossible de contacter le serveur. Vérifiez votre connexion internet.",
    );
  } else {
    throw new Error("Erreur de configuration de la requête");
  }
};

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
  getAll: (accountId: string, walletId: string) =>
    apiWithRetry(() =>
      api.get<Transaction[]>(
        `/account/${accountId}/wallet/${walletId}/transaction`,
      ),
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
    data: Transaction,
  ) =>
    apiWithRetry(() =>
      api.put<Transaction>(
        `/account/${accountId}/wallet/${walletId}/transaction/${transactionId}`,
        data,
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
