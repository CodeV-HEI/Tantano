export type WalletType = 'CASH' | 'MOBILE_MONEY' | 'BANK' | 'DEBT';

export interface Wallet {
    id: string;
    name: string;
    description?: string;
    type: WalletType;
    amount: number;
    isActive: boolean;
    color: string;
    iconRef?: string;
    walletAutomaticIncome?: {
        type: 'NOT_SPECIFIED' | 'MENSUAL';
        amount: number;
        paymentDay: number;
    };
}

export interface WalletWithUI extends Wallet {
    _isUpdating?: boolean;
    _isDeleting?: boolean;
    _isArchiving?: boolean;
    _showDetails?: boolean;
}

export interface PaginationInfo {
    totalPage: number;
    page: number;
    hasNext: boolean;
    hasPrev: boolean;
}


export const WALLET_COLOR_PALETTE = [
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
];
