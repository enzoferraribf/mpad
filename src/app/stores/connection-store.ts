'use client';

import { create } from 'zustand';

interface ConnectionState {
    connections: number;
    transaction: number;
}

interface ConnectionActions {
    setConnections: (connections: number) => void;
    setTransaction: (transaction: number) => void;
}

export const useConnectionStore = create<ConnectionState & ConnectionActions>(set => ({
    connections: 1,
    transaction: 0,

    setConnections: connections => set({ connections }),
    setTransaction: transaction => set({ transaction }),
}));
