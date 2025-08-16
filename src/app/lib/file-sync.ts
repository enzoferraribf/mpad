import { Doc, encodeStateAsUpdate, applyUpdate } from 'yjs';

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

export const persistDocumentToLocalStorage = (document: Doc, pathname: string): void => {
    const update = encodeStateAsUpdate(document);
    const key = `missopad.files.${pathname}`;
    localStorage.setItem(key, JSON.stringify(Array.from(update)));
};

export const loadDocumentFromLocalStorage = (document: Doc, pathname: string): boolean => {
    const key = `missopad.files.${pathname}`;
    const storedState = localStorage.getItem(key);
    if (storedState) {
        const updateArray = JSON.parse(storedState);
        const update = new Uint8Array(updateArray);
        applyUpdate(document, update);
        return true;
    }
    return false;
};
