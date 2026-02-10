export interface Credentials {
    username: string;
    password: string;
}

export interface User {
    id: string;
    username: string;
    createdAt?: string;
}

export interface UserWithToken {
    account: User;
    token: string;
}

export type LoginRequest = Credentials
export type RegisterRequest = Credentials

export interface PaginationResult {
    totalPage: number;
    page: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface CreationLabel {
    name: string;
}

export interface Label extends CreationLabel {
    id: string;
}

export interface PaginatedLabels {
    pagination: PaginationResult;
    values: Label[];
}

export enum WalletType {
    CASH = "CASH",
    MOBILE_MONEY = "MOBILE_MONEY",
    BANK = "BANK",
    DEBT = "DEBT"
}

export enum AutomaticIncomeType {
    NOT_SPECIFIED = "NOT_SPECIFIED",
    MENSUAL = "MENSUAL"
}

export interface WalletAutomaticIncome {
    type: AutomaticIncomeType;
    amount?: number;
    paymentDay?: number;
}

export interface CreationWallet {
    name: string;
    description?: string;
    type: WalletType;
}

export interface UpdateWallet extends CreationWallet {
    id: string;
    accountId: string;
    isActive: boolean;
}

export interface Wallet extends UpdateWallet {
    amount: number;
    walletAutomaticIncome?: WalletAutomaticIncome;
}

export interface PaginatedWallets {
    pagination: PaginationResult;
    values: Wallet[];
}

export enum TransactionType {
    IN = "IN",
    OUT = "OUT"
}

export interface CreationTransaction {
    date: string;
    labels: Label[];
    type: TransactionType;
    description?: string;
    amount: number;
    walletId: string;
    accountId: string;
}

export interface Transaction extends CreationTransaction {
    id: string;
}

export interface WalletMinimalInfo {
    name: string;
    description?: string;
    type: WalletType;
}

export interface TransactionMinimalInfo {
    date: string;
    type: TransactionType;
    walletId: string;
    amount: number;
    labels: Label[]; // Utilise le type Label complet comme dans l'OpenAPI
    description: string;
}

export interface LabelMinimalInfo {
    name: string;
}

export interface WalletUpdateInfo {
    name?: string;
    description?: string;
    type?: WalletType;
    isActive?: boolean;
}

export interface TransactionUpdateInfo {
    date?: string;
    type?: TransactionType;
    walletId?: string;
    amount?: number;
    labels?: Label[];
    description?: string;
}

export interface LabelUpdateInfo {
    name?: string;
}