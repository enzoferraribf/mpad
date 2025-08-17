import { useFileStore } from '@/app/stores/file-store';

import { Button } from '@/app/components/shadcn/button';

import { formatFileSize } from '@/app/lib/file';
import { formatUploadDate } from '@/app/lib/datetime';

import { IFileList, IEphemeralFile } from '@/app/models/files';

export function FileList({ files }: IFileList) {
    const { removeFile } = useFileStore();

    const handleDownload = (file: IEphemeralFile) => {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    };

    const handleDelete = (id: string) => {
        removeFile(id);
    };

    if (files.length === 0) {
        return (
            <div className="p-4 text-muted-foreground">
                No files uploaded yet. Use the Upload File command to add files.
            </div>
        );
    }

    return (
        <div className="scrollbar-hide max-h-[36rem] overflow-y-auto">
            {files.map(file => (
                <div
                    key={file.id}
                    className="mb-2 flex items-center justify-between rounded-md border border-border p-3"
                >
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
