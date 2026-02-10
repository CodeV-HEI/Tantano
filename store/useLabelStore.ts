import { Label } from "@/types";
import { create } from "zustand";

interface LabelStore {
  labels: Label[];
  addLabel: (label: Label) => void;
  removeLabel: (labelId: string) => void;
  setLabels: (labels: Label[]) => void;
}

export const useLabelStore = create<LabelStore>((set) => ({
  labels: [],
  addLabel: (label: Label) =>
    set((state) => ({ labels: [...state.labels, label] })),
  removeLabel: (labelId: string) =>
    set((state) => ({
      labels: state.labels.filter((label) => label.id !== labelId),
    })),
  setLabels: (labels: Label[]) => set({ labels }),
}));
