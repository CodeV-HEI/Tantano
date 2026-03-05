import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { LabelCard } from './LabelCard';

interface Label {
    id: string;
    name: string;
    _isDeleting?: boolean;
    color: string;  
}

interface Props {
    labels: Label[];
    isUpdating: Record<string, boolean>;
    onEdit: (id: string, name: string, color: string) => void;
    onDelete: (id: string, name: string) => void;
    searchQuery: string;
}

const DEFAULT_LABELS = ['NOURRITURE', 'TRANSPORT', 'LOISIRS'];

export const LabelList = ({ labels, isUpdating, onEdit, onDelete, searchQuery }: Props) => {
    const { theme } = useTheme();

    const filteredLabels = labels.filter(label =>
        label && label.name &&
        label.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredLabels.length === 0) {
        return null;
    }

    return (
        <>
            {filteredLabels.map((label) => (
                <LabelCard
                    key={label.id}
                    label={label}
                    isDefault={DEFAULT_LABELS.includes(label.name)}
                    isUpdating={isUpdating[label.id]}
                    onEdit={() => onEdit(label.id, label.name, label.color)} 
                    onDelete={() => onDelete(label.id, label.name)}
                />
            ))}
        </>
    );
};