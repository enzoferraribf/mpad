'use client';

import { create } from 'zustand';
import { Doc } from 'yjs';

interface DocumentState {
    textDocument: Doc | null;
    textModified: boolean;
    textUpdated: string;
}

interface DocumentActions {
    setTextDocument: (doc: Doc) => void;
    setTextModified: (modified: boolean) => void;
    setTextUpdated: (updated: string) => void;
    getTextContent: () => string;
    getTextLoaded: () => boolean;
}

export const useDocumentStore = create<DocumentState & DocumentActions>((set, get) => ({
    textDocument: null,

    textModified: false,

    textUpdated: '',

    setTextDocument: textDocument => {
        set({ textDocument });

        const ytext = textDocument.getText('monaco');

        // Subscribe to Y.js text changes to trigger re-renders
        ytext.observe(() => set({ textDocument }));
    },

    setTextModified: textModified => set({ textModified }),

    setTextUpdated: textUpdated => set({ textUpdated }),

    getTextContent: () => {
        const { textDocument } = get();
        if (!textDocument) return '';
        return textDocument.getText('monaco').toString();
    },

    getTextLoaded: () => {
        const { textDocument } = get();
        return textDocument !== null;
    },
}));
