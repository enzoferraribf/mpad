import { useUIStore } from '@/app/stores/ui-store';
import { useFileStore } from '@/app/stores/file-store';
import { FileList } from '@/app/components/file-list';

import { CommandDialog, CommandGroup, CommandInput, CommandList } from '@/app/components/shadcn/command';

export function Storage() {
    const { storage, setStorage } = useUIStore();
    const { getFiles } = useFileStore();
    const files = getFiles();

    return (
        <CommandDialog open={storage} onOpenChange={setStorage}>
            <CommandInput placeholder="Search files..." />

            <CommandList>
                <CommandGroup heading={`Storage (${files.length} files)`}>
                    <FileList files={files} />
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
