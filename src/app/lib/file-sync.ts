import { Doc } from 'yjs';

interface FileInfo {
    id: string;
    name: string;
    size: number;
    type: string;
    data: string;
    uploadedAt: number;
}

export const addFile = (document: Doc, file: FileInfo): void => {
    const files = document.getArray<FileInfo>('files');
    files.push([file]);
};

export const removeFile = (document: Doc, id: string): boolean => {
    const files = document.getArray<FileInfo>('files');
    const items = files.toArray();
    const index = items.findIndex(file => file.id === id);

    if (index !== -1) {
        files.delete(index, 1);
        return true;
    }
    return false;
};

export const getFiles = (document: Doc): FileInfo[] => {
    const files = document.getArray<FileInfo>('files');
    return files.toArray();
};

type UnobserveCallback = () => void;
type FileUpdateCallback = (files: FileInfo[]) => void;

export const setupFileObserver = (document: Doc, onFilesChanged: FileUpdateCallback): UnobserveCallback => {
    const files = document.getArray<FileInfo>('files');

    const observer = () => {
        const items = files.toArray();
        onFilesChanged(items);
    };

    files.observe(observer);

    const initial = files.toArray();
    if (initial.length > 0) {
        onFilesChanged(initial);
    }

    return () => {
        files.unobserve(observer);
    };
};
