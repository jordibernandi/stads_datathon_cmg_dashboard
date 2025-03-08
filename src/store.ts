import { create } from 'zustand';
import { StateData } from './types/StateData';

interface FilterState {
    masterState: StateData | null;
    masterStartDate: string | null;
    masterEndDate: string | null;
    setMasterState: (masterState: StateData | null) => void;
    setMasterStartDate: (mastersStartDate: string) => void;
    setMasterEndDate: (masterEndDate: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    masterState: null,
    masterStartDate: "",
    masterEndDate: "",
    setMasterState: (masterState) => set(() => ({ masterState })),
    setMasterStartDate: (masterStartDate) => set(() => ({ masterStartDate })),
    setMasterEndDate: (masterEndDate) => set(() => ({ masterEndDate })),
}));
