'use client';

import { create } from 'zustand';

interface WindowDimensions {
    width: number;
    height: number;
}

interface WindowState {
    window: WindowDimensions;
}

interface WindowActions {
    setWindow: (window: WindowDimensions) => void;
}

export const useWindowStore = create<WindowState & WindowActions>(set => ({
    window: { width: 0, height: 0 },

    setWindow: window => set({ window }),
}));
