import { Doc } from 'yjs';

import { FileUploadBuilder } from '@/app/builders/file-upload-builder';

export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB'];
    const index = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
};

export const handleFileUpload = (fileDocument: Doc | null) => {
    if (!fileDocument) return;

    FileUploadBuilder.create()
        .withFileDocument(fileDocument)
        .withMultiple(true)
        .withValidation((file: File) => file.size <= 1 * 1024 * 1024, 'File is larger than 1MB limit')
        .withValidation((_: File, currentCount: number) => currentCount < 5, 'Maximum of 5 files allowed per pad')
        .upload();
};
