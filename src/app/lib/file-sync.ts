import { Doc, encodeStateAsUpdate, applyUpdate } from 'yjs';

import { EphemeralFile } from '@/app/context/context';

export const addFile = (document: Doc, file: EphemeralFile): void => {
    const files = document.getArray<EphemeralFile>('files');
    files.push([file]);
};

export const removeFile = (document: Doc, id: string): boolean => {
    const files = document.getArray<EphemeralFile>('files');
    const index = files.toArray().findIndex(file => file.id === id);

    if (index === -1) return false;

    files.delete(index, 1);
    return true;
};

export const getFiles = (document: Doc): EphemeralFile[] => document.getArray<EphemeralFile>('files').toArray();
