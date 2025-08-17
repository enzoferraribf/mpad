'use client';

import { create } from 'zustand';

interface UIState {
    layout: 'editor' | 'preview' | 'default';
    explorer: boolean;
    command: boolean;
    help: boolean;
    storage: boolean;
    excalidraw: boolean;
    drawings: boolean;
}

interface UIActions {
    setLayout: (layout: 'editor' | 'preview' | 'default') => void;
    setExplorer: (explorer: boolean) => void;
    setCommand: (command: boolean) => void;
    setHelp: (help: boolean) => void;
    setStorage: (storage: boolean) => void;
    setExcalidraw: (excalidraw: boolean) => void;
    setDrawings: (drawings: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>(set => ({
    layout: 'default',
    explorer: false,
    command: false,
    help: false,
    storage: false,
    excalidraw: false,
    drawings: false,

    setLayout: layout => set({ layout }),
    setExplorer: explorer => set({ explorer }),
    setCommand: command => set({ command }),
    setHelp: help => set({ help }),
    setStorage: storage => set({ storage }),
    setExcalidraw: excalidraw => set({ excalidraw }),
    setDrawings: drawings => set({ drawings }),
}));
