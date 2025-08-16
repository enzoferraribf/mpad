import { useContext } from 'react';
import { ApplicationContext, EphemeralFile } from '@/app/context/context';
import { addFile } from '@/app/lib/file-sync';
import { toast } from 'sonner';

const FILE_SIZE_LIMIT = 5 * 1024 * 1024;
const MAX_FILES = 5;

export const useFileUpload = () => {
    const { context } = useContext(ApplicationContext);

    const validateFile = (file: File, currentFileCount: number): string | null => {
        if (file.size > FILE_SIZE_LIMIT) {
            return `${file.name} is larger than 5MB limit`;
        }
        if (currentFileCount >= MAX_FILES) {
            return "Maximum of 5 files allowed per pad";
        }
        return null;
    };

    const showToast = (type: 'error' | 'success', title: string, description: string) => {
        toast[type](title, { description });
    };

    const processFile = (file: File) => {
        if (!context.fileDocument) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const newFile: EphemeralFile = {
                id: crypto.randomUUID(),
                name: file.name,
                size: file.size,
                type: file.type,
                data: e.target?.result as string,
                uploadedAt: Date.now()
            };
            
            addFile(context.fileDocument!, newFile);
            showToast('success', 'File uploaded', `${file.name} has been uploaded successfully`);
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
                const error = validateFile(file, context.files.length + validCount);
                
                if (error) {
                    showToast('error', 'Upload failed', error);
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