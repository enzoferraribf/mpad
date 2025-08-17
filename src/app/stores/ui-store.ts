'use client';

import { create } from 'zustand';

interface UIState {
    layout: 'editor' | 'preview' | 'default';
    explorer: boolean;
    command: boolean;
    help: boolean;
    storage: boolean;
}

interface UIActions {
    setLayout: (layout: 'editor' | 'preview' | 'default') => void;
    setExplorer: (explorer: boolean) => void;
    setCommand: (command: boolean) => void;
    setHelp: (help: boolean) => void;
    setStorage: (storage: boolean) => void;
}

export const useUIStore = create<UIState & UIActions>(set => ({
    layout: 'default',
    explorer: false,
    command: false,
    help: false,
    storage: false,

    setLayout: layout => set({ layout }),
    setExplorer: explorer => set({ explorer }),
    setCommand: command => set({ command }),
    setHelp: help => set({ help }),
    setStorage: storage => set({ storage }),
}));
