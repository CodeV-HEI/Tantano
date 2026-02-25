
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
    color?: string;         
    iconRef?: string;      
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

export type AutomaticIncomeType = 'NOT_SPECIFIED' | 'MENSUAL';

export interface WalletAutomaticIncome {
    type: AutomaticIncomeType;
    amount?: number;       
}

export interface CreationWallet {
    name: string;
    description?: string;
    type: WalletType;
    color?: string;       
    iconRef?: string;      
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
    color?: string;        
    iconRef?: string;      
}

export interface TransactionMinimalInfo {
    date: string;
    type: TransactionType;
    walletId: string;
    amount: number;
    labels: Label[];
    description: string;
}

export interface LabelMinimalInfo {
    name: string;
    color?: string;        
    iconRef?: string;      
}



export interface WalletUpdateInfo {
    name?: string;
    description?: string;
    type?: WalletType;
    isActive?: boolean;
    color?: string;        
    iconRef?: string;      
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
    color?: string;        
    iconRef?: string;      
}