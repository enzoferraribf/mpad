import { toast } from 'sonner';
import { Doc } from 'yjs';

import { addFile } from '@/app/lib/file-sync';

import { IEphemeralFile } from '@/app/models/files';

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const MAX_FILES = 5;

const validateFile = (file: File, currentFileCount: number): string | null => {
    if (file.size > FILE_SIZE_LIMIT) {
        return `${file.name} is larger than 5MB limit`;
    }

    if (currentFileCount >= MAX_FILES) {
        return 'Maximum of 5 files allowed per pad';
    }

    return null;
};

const showToast = (type: 'error' | 'success', title: string, description: string) => {
    toast[type](title, { description });
};

const processFile = (file: File, fileDocument: Doc) => {
    const reader = new FileReader();

    reader.onload = e => {
        const newFile: IEphemeralFile = {
            id: crypto.randomUUID(),
            name: file.name,
            size: file.size,
            type: file.type,
            data: e.target?.result as string,
            uploadedAt: Date.now(),
        };

        addFile(fileDocument, newFile);

        showToast('success', 'File uploaded', `${file.name} has been uploaded successfully`);
    };

    reader.readAsDataURL(file);
};

export const handleFileUpload = (fileDocument: Doc | null) => {
    if (!fileDocument) return;

    const yarray = fileDocument.getArray<IEphemeralFile>('files');

    const currentFileCount = yarray.toArray().length;

    const input = document.createElement('input');

    input.type = 'file';
    input.multiple = true;

    input.onchange = e => {
        const files = (e.target as HTMLInputElement).files;
        if (!files) return;

        let validCount = 0;

        Array.from(files).forEach(file => {
            const error = validateFile(file, currentFileCount + validCount);

            if (error) {
                showToast('error', 'Upload failed', error);
                return;
            }

            validCount++;

            processFile(file, fileDocument);
        });
    };

    input.click();
};
