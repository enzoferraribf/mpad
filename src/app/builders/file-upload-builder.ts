import { toast } from 'sonner';
import { Doc } from 'yjs';

import { useFileStore } from '@/app/stores/file-store';
import { IEphemeralFile } from '@/app/models/files';

export class FileUploadBuilder {
    private fileDocument: Doc | null = null;
    private multiple: boolean | null = null;
    private onSuccess: ((file: IEphemeralFile) => void) | null = null;
    private onError: ((error: string) => void) | null = null;
    private fileProcessor: ((file: File, doc: Doc) => void) | null = null;
    private inputAccept: string | null = null;
    private validationRules: Array<{ validator: (file: File, currentCount: number) => boolean; message: string }> = [];

    static create() {
        return new FileUploadBuilder();
    }

    withFileDocument(fileDocument: Doc) {
        this.fileDocument = fileDocument;
        return this;
    }

    withValidation(validator: (file: File, currentCount: number) => boolean, message: string) {
        this.validationRules.push({ validator, message });
        return this;
    }

    withMultiple(multiple: boolean) {
        this.multiple = multiple;
        return this;
    }

    withOnSuccess(callback: (file: IEphemeralFile) => void) {
        this.onSuccess = callback;
        return this;
    }

    withOnError(callback: (error: string) => void) {
        this.onError = callback;
        return this;
    }

    withFileProcessor(processor: (file: File, doc: Doc) => void) {
        this.fileProcessor = processor;
        return this;
    }

    withInputAccept(accept: string) {
        this.inputAccept = accept;
        return this;
    }

    upload(): void {
        if (!this.fileDocument) {
            throw new Error('File document is required for upload');
        }
        if (this.multiple === null) {
            throw new Error('Multiple setting is required for upload');
        }

        const yarray = this.fileDocument.getArray<IEphemeralFile>('files');
        const currentFileCount = yarray.toArray().length;

        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = this.multiple;

        if (this.inputAccept) {
            input.accept = this.inputAccept;
        }

        input.onchange = e => {
            const files = (e.target as HTMLInputElement).files;

            if (!files) return;

            let validCount = 0;

            Array.from(files).forEach(file => {
                const error = this.validateFile(file, currentFileCount + validCount);

                if (error) {
                    this.handleError(error);
                    return;
                }

                validCount++;
                this.processFile(file);
            });
        };

        input.click();
    }

    private validateFile(file: File, currentFileCount: number): string | null {
        for (const rule of this.validationRules) {
            if (!rule.validator(file, currentFileCount)) {
                return rule.message;
            }
        }
        return null;
    }

    private processFile(file: File): void {
        if (this.fileProcessor) {
            this.fileProcessor(file, this.fileDocument!);
            return;
        }

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

            useFileStore.getState().addFile(newFile);
            this.handleSuccess(newFile);
        };

        reader.readAsDataURL(file);
    }

    private handleSuccess(file: IEphemeralFile): void {
        if (this.onSuccess) {
            this.onSuccess(file);
        } else {
            toast.success('File uploaded', {
                description: `${file.name} has been uploaded successfully`,
            });
        }
    }

    private handleError(error: string): void {
        if (this.onError) {
            this.onError(error);
        } else {
            toast.error('Upload failed', { description: error });
        }
    }
}
