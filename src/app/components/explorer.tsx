import { useContext } from 'react';

import { useRouter } from 'next/navigation';

import { Badge } from '@/app/components/badge';

import { ApplicationContext } from '@/app/context/context';

import { CommandDialog, CommandGroup, CommandInput, CommandItem } from '@/app/components/command';

export function Explorer({ related }: { related: string[] }) {
    const { push } = useRouter();

    const { context, setContext } = useContext(ApplicationContext);

    const handleNavigation = (pad: string) => push(pad);

    return (
        <CommandDialog open={context.explorer} onOpenChange={open => setContext({ explorer: open })}>
            <CommandInput placeholder="Search for a Pad..." />

            <CommandGroup heading="Pads">
                <div className="max-h-[36rem] max-w-fit overflow-y-scroll">
                    {related.map((related, index) => {
                        const paths = related.split('/').filter(path => path);
                        const lastPath = paths.pop();

                        return (
                            <CommandItem key={index} onSelect={() => handleNavigation(related)}>
                                <div key={index} className="flex flex-row space-x-2 text-nowrap text-sm">
                                    {/* Search seems to be based on inner elements. I added this hidden span so the search works with the full path */}
                                    <span hidden>{related}</span>

                                    {paths.map((path, index) => (
                                        <Badge key={index}>{path}</Badge>
                                    ))}

                                    <p key={index}>{decodeURIComponent(lastPath!)}</p>
                                </div>
                            </CommandItem>
                        );
                    })}
                </div>
            </CommandGroup>
        </CommandDialog>
    );
}
