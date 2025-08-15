import { useContext } from 'react';

import { ApplicationContext } from '@/app/context/context';
import { FileList } from '@/app/components/file-list';

import { CommandDialog, CommandGroup, CommandInput, CommandList } from '@/app/components/shadcn/command';

export function Storage() {
    const { context, setContext } = useContext(ApplicationContext);

    return (
        <CommandDialog open={context.storage} onOpenChange={open => setContext({ storage: open })}>
            <CommandInput placeholder="Search files..." />

            <CommandList>
                <CommandGroup heading={`Storage (${context.files.length} files)`}>
                    <FileList files={context.files} />
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
