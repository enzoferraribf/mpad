import { useContext } from 'react';
import { ApplicationContext } from '@/app/context/context';
import { addFile } from '@/app/lib/file-sync';
import { toast } from 'sonner';

interface FileInfo {
    id: string;
    name: string;
    size: number;
    type: string;
    data: string;
    uploadedAt: number;
}

const FILE_SIZE_LIMIT = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 5;

interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const useFileUpload = () => {
    const { context } = useContext(ApplicationContext);

    const validateFile = (file: File, currentFileCount: number): ValidationResult => {
        if (file.size > FILE_SIZE_LIMIT) {
            return {
                isValid: false,
                error: `${file.name} is larger than 5MB limit`
            };
        }

        if (currentFileCount >= MAX_FILES) {
            return {
                isValid: false,
                error: "Maximum of 5 files allowed per pad"
            };
        }

        return { isValid: true };
    };

    const showError = (error: string) => {
        toast.error("Upload failed", {
            description: error,
        });
    };

    const showSuccess = (fileName: string) => {
        toast.success("File uploaded", {
            description: `${fileName} has been uploaded successfully`,
        });
    };

    const processFile = (file: File) => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const newFile: FileInfo = {
                id: crypto.randomUUID(),
                name: file.name,
                size: file.size,
                type: file.type,
                data: e.target?.result as string,
                uploadedAt: Date.now()
            };

            if (!context.fileDocument) return;
            
            addFile(context.fileDocument, newFile);
            showSuccess(file.name);
        };
        
        reader.readAsDataURL(file);
    };

    const handleFileUpload = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        
        input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (!files) return;

            let validCount = 0;
            Array.from(files).forEach(file => {
                const validation = validateFile(file, context.files.length + validCount);
                
                if (!validation.isValid) {
                    showError(validation.error!);
                    return;
                }

                validCount++;
                processFile(file);
            });
        };

        input.click();
    };

    return { handleFileUpload };
};