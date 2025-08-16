import { useContext } from 'react';

import { useRouter } from 'next/navigation';

import { ApplicationContext } from '@/app/context/context';

import { Badge } from '@/app/components/shadcn/badge';
import { CommandDialog, CommandGroup, CommandInput, CommandItem } from '@/app/components/shadcn/command';

export function Explorer({ related }: { related: string[] }) {
    const { push } = useRouter();

    const { context, setContext } = useContext(ApplicationContext);

    const handleNavigation = (pad: string) => push(pad);

    return (
        <CommandDialog open={context.explorer} onOpenChange={open => setContext({ explorer: open })}>
            <CommandInput placeholder="Search for a Pad..." />

            <CommandGroup heading="Pads">
                <div className="max-h-[36rem] overflow-y-scroll">
                    {related.map((related, index) => {
                        const paths = related.split('/').filter(path => path);
                        const lastPath = paths.pop();

                        return (
                            <CommandItem key={index} onSelect={() => handleNavigation(related)}>
                                <div key={index} className="file-path-spacing status-text flex text-nowrap">
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
