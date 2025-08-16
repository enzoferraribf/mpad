import { useContext } from 'react';

import { ApplicationContext, EphemeralFile } from '@/app/context/context';
import { removeFile } from '@/app/lib/file-sync';
import { formatFileSize, formatUploadDate } from '@/app/utils/file';

import { Button } from '@/app/components/shadcn/button';

interface FileListProps {
    files: EphemeralFile[];
}

export function FileList({ files }: FileListProps) {
    const { context } = useContext(ApplicationContext);

    const handleDownload = (file: EphemeralFile) => {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    };

    const handleDelete = (id: string) => {
        if (!context.fileDocument) return;

        removeFile(context.fileDocument, id);
    };

    if (files.length === 0) {
        return <div className="p-4 text-muted-foreground">No files uploaded yet. Use the "Upload File" command to add files.</div>;
    }

    return (
        <div className="scrollbar-hide max-h-[36rem] overflow-y-auto">
            {files.map(file => (
                <div key={file.id} className="mb-2 flex items-center justify-between rounded-md border border-border p-3">
                    <div className="flex min-w-0 flex-1 flex-col space-y-1">
                        <span className="truncate font-medium text-foreground">{file.name}</span>
                        <span className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)} • {formatUploadDate(file.uploadedAt)}
                        </span>
                    </div>

                    <div className="ml-4 flex gap-2">
                        <Button
                            onClick={e => {
                                e.stopPropagation();
                                handleDownload(file);
                            }}
                            variant="outline"
                            size="sm"
                        >
                            Download
                        </Button>
                        <Button
                            onClick={e => {
                                e.stopPropagation();
                                handleDelete(file.id);
                            }}
                            variant="destructive"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
