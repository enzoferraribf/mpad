'use client';

import { create } from 'zustand';
import { Doc } from 'yjs';

import { IEphemeralFile } from '@/app/models/files';

interface FileState {
    fileDocument: Doc | null;
}

interface FileActions {
    setFileDocument: (doc: Doc) => void;
    getFiles: () => IEphemeralFile[];
    addFile: (file: IEphemeralFile) => void;
    removeFile: (id: string) => boolean;
}

export const useFileStore = create<FileState & FileActions>((set, get) => ({
    fileDocument: null,

    setFileDocument: fileDocument => {
        set({ fileDocument });

        const yarray = fileDocument!.getArray<IEphemeralFile>('files');

        // Force a re-render by setting the same document (Zustand will detect the change)
        yarray.observe(() => set({ fileDocument }));
    },

    getFiles: () => {
        const { fileDocument } = get();

        if (!fileDocument) return [];

        const yarray = fileDocument.getArray<IEphemeralFile>('files');

        return yarray.toArray();
    },

    addFile: (file: IEphemeralFile) => {
        const { fileDocument } = get();

        if (!fileDocument) return;

        const files = fileDocument.getArray<IEphemeralFile>('files');
        files.push([file]);
    },

    removeFile: (id: string) => {
        const { fileDocument } = get();

        if (!fileDocument) return false;

        const files = fileDocument.getArray<IEphemeralFile>('files');
        const index = files.toArray().findIndex(file => file.id === id);

        if (index === -1) return false;

        files.delete(index, 1);
        return true;
    },
}));
