export interface User {
    id: string;
    username: string;
    email: string;
}

export interface UserWithApiKey extends User {
    apiKey: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export enum WalletType {
    CASH = "CASH",
    BANK_ACCOUNT = "BANK_ACCOUNT",
    MOBILE_MONEY = "MOBILE_MONEY",
    CRYPTO = "CRYPTO"
}

export interface WalletMinimalInfo {
    name: string;
    reference: string;
    type: WalletType;
}

export interface Wallet extends WalletMinimalInfo {
    id: string;
    createdAt: string;
}

export enum TransactionType {
    IN = "IN",
    OUT = "OUT"
}

export interface TransactionMinimalInfo {
    date: string;
    transactionType: TransactionType;
    walletReference: string;
    amount: number;
    labels: string[];
    description: string;
}

export interface Transaction {
    id: string;
    date: string;
    transactionType: TransactionType;
    walletReference: string;
    amount: number;
    labels: Label[];
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface LabelMinimalInfo {
    name: string;
    reference: string;
}

export interface Label extends LabelMinimalInfo {
    id: string;
    createdAt: string;
    updatedAt: string;
}

// Types pour les mises à jour
export interface WalletUpdateInfo {
    name?: string;
    reference?: string;
    type?: WalletType;
}

export interface TransactionUpdateInfo {
    date?: string;
    transactionType?: TransactionType;
    walletReference?: string;
    amount?: number;
    labels?: string[];
    description?: string;
}

export interface LabelUpdateInfo {
    name?: string;
    reference?: string;
}