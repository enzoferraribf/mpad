import { Doc } from 'yjs';

import { IEphemeralFile } from '@/app/models/files';

export const addFile = (document: Doc, file: IEphemeralFile): void => {
    const files = document.getArray<IEphemeralFile>('files');

    files.push([file]);
};

export const removeFile = (document: Doc, id: string): boolean => {
    const files = document.getArray<IEphemeralFile>('files');

    const index = files.toArray().findIndex(file => file.id === id);

    if (index === -1) return false;

    files.delete(index, 1);

    return true;
};

export const getFiles = (document: Doc): IEphemeralFile[] => document.getArray<IEphemeralFile>('files').toArray();
