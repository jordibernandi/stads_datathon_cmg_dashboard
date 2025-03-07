import { create } from 'zustand';
import { StateData } from './types/StateData';

interface FilterState {
    masterState: StateData | null;
    mastersStartDate: string | null;
    masterEndDate: string | null;
    setMasterState: (masterState: StateData | null) => void;
    setMasterStartDate: (mastersStartDate: string) => void;
    setMasterEndDate: (masterEndDate: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
    masterState: null,
    mastersStartDate: "",
    masterEndDate: "",
    setMasterState: (masterState) => set(() => ({ masterState })),
    setMasterStartDate: (mastersStartDate) => set(() => ({ mastersStartDate })),
    setMasterEndDate: (masterEndDate) => set(() => ({ masterEndDate })),
}));
