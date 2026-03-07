
export interface Credentials {
  email: string;
  password: string;
}

export type Recurrence = "daily" | "weekly" | "monthly";
export interface Pagination {
  totalPage: number;
  page: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  pagination: Pagination;
  values: T[];
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  createdAt?: string;
}

export interface AsyncStorageUser{
    id: string;
    username: string;
}

export interface UserWithToken {
  account: User;
  token: string;
}

export type LoginRequest = Credentials;
export type RegisterRequest = Credentials;

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
  DEBT = "DEBT",
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

export interface TransactionFilters {
  walletId?: string;
  startingDate?: string;       // ISO 8601 : "2024-01-01T00:00:00.000Z"
  endingDate?: string;         // ISO 8601 : "2024-01-31T23:59:59.999Z"
  type?: "IN" | "OUT";
  label?: string[];
  minAmount?: number;
  maxAmount?: number;
  sortBy?: "date" | "amount";
  sort?: "asc" | "desc";
}

export interface PaginatedWallets {
  pagination: PaginationResult;
  values: Wallet[];
}

export enum TransactionType {
  IN = "IN",
  OUT = "OUT",
}

export interface CreationTransaction {
  date: string;
  labels: Label[];
  type: TransactionType;
  description?: string;
  amount: number;
  walletId: string;
  accountId: string;
  goalId: string,
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
  description?: string;
  type: WalletType;
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

// types/project.ts

export interface CreationProject {
  name: string;
  description?: string;
  initialBudget: number;
  color?: string;
  iconRef?: string;
}

export interface Project extends CreationProject {
  id: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
}

export interface CreationProjectTransaction {
  name: string;
  description?: string;
  estimatedCost: number;
  realCost?: number;
}

export interface ProjectTransaction extends CreationProjectTransaction {
  id: string;
  projectId: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStatistics {
  project: Project;
  totalEstimatedCost: number;
  totalRealCost: number;
  remainingBudget: number;
  transactionCount: number;
}

export interface TransactionFilter {
  walletId: string | undefined;
  startingDate: string | undefined;
  endingDate: string | undefined;
  type: TransactionType | undefined;
  label: string[];
  minAmount: number | undefined;
  maxAmount: number | undefined;
  sortBy: "date" | "amount";
  sort: "asc" | "desc";
}

export interface CreationGoal {
  name: string;
  amount: number;
  walletId: string;
  startingDate: string; 
  endingDate: string;
  color: string;
  iconRef: string;
}

export interface Goal{
    id: string;
      name: string;
  amount: number;
  walletId: string;
  startingDate: string; 
  endingDate: string;
  color: string;
  iconRef: string;
}
