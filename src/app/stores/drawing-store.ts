'use client';

import { create } from 'zustand';
import { Doc } from 'yjs';

import { IDrawing } from '@/app/models/drawing';

interface DrawingState {
    drawingDocument: Doc | null;
    selectedDrawingId: string | null;
}

interface DrawingActions {
    setDrawingDocument: (doc: Doc) => void;
    setSelectedDrawingId: (id: string | null) => void;
    getSelectedDrawing: () => IDrawing | null;
    addDrawing: (name: string, url: string) => void;
    getDrawings: () => IDrawing[];
    removeDrawing: (id: string) => void;
}

export const useDrawingStore = create<DrawingState & DrawingActions>((set, get) => ({
    drawingDocument: null,
    selectedDrawingId: null,

    setDrawingDocument: drawingDocument => {
        set({ drawingDocument });

        const ymap = drawingDocument.getMap<IDrawing>('drawings');

        // Force a re-render by setting the same document (Zustand will detect the change)
        ymap.observe(() => set({ drawingDocument }));
    },

    setSelectedDrawingId: selectedDrawingId => set({ selectedDrawingId }),

    getSelectedDrawing: () => {
        const { selectedDrawingId } = get();
        if (!selectedDrawingId) return null;

        const drawings = get().getDrawings();
        return drawings.find(drawing => drawing.id === selectedDrawingId) || null;
    },

    addDrawing: (name: string, url: string) => {
        const { drawingDocument } = get();

        if (!drawingDocument) return;

        const drawings = drawingDocument.getMap<IDrawing>('drawings');

        const drawing: IDrawing = {
            id: name,
            name,
            url,
            created: new Date().toISOString(),
        };

        drawings.set(name, drawing);
    },

    getDrawings: () => {
        const { drawingDocument } = get();

        if (!drawingDocument) return [];

        const ymap = drawingDocument.getMap<IDrawing>('drawings');

        return Array.from(ymap.values());
    },

    removeDrawing: (id: string) => {
        const { drawingDocument } = get();

        if (!drawingDocument) return;

        const drawings = drawingDocument.getMap<IDrawing>('drawings');

        if (drawings.has(id)) {
            drawings.delete(id);
        }
    },
}));
