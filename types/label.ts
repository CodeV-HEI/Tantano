export interface Label {
    id: string;
    name: string;
    color: string;
    iconRef?: string;
}

export interface LabelWithUI extends Label {
    _isDeleting?: boolean;
    _isUpdating?: boolean;
    _isArchiving?: boolean;
}


export const COLOR_PALETTE = [
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
    '#6C5B7B', // Violet foncé
    '#F9D56E'  // Moutarde
];

export const DEFAULT_LABELS = [
    { name: 'NOURRITURE', color: '#FF6B6B' },
    { name: 'TRANSPORT', color: '#4ECDC4' },
    { name: 'LOISIRS', color: '#FFD93D' }
];

export const isDefaultLabel = (name: string): boolean => {
    return DEFAULT_LABELS.some(d => d.name === name);
};

