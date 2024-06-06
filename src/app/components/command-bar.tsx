import { useContext } from 'react';

import { useTheme } from 'next-themes';

import { ApplicationContext } from '@/app/context/context';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/command';

export function CommandBar() {
    const { setTheme } = useTheme();

    const { context, setContext } = useContext(ApplicationContext);

    const handleFiles = () => {
        setContext({ explorer: true, command: !context.command });
    };

    const handleLayout = (layout: 'editor' | 'preview' | 'default') => {
        setContext({ layout, command: !context.command });
    };

    const handleTheme = (theme: 'light' | 'dark') => {
        setTheme(theme);
        setContext({ command: !context.command });
    };

    return (
        <CommandDialog open={context.command} onOpenChange={open => setContext({ command: open })}>
            <CommandInput placeholder="Type a command or search..." />

            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>

                <CommandGroup heading="Files">
                    <CommandItem onSelect={() => handleFiles()}>
                        <div className="space-y-5">
                            <h1 className="font-bold">📁 Explorer</h1>
                            <span className="text-xs">{"View this pad's file structure."}</span>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Layout">
                    <CommandItem onSelect={() => handleLayout('editor')}>
                        <div className="space-y-5">
                            <h1 className="font-bold">✏️ Editor</h1>
                            <span className="text-xs">Changes the Mpad view to edit-only.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleLayout('preview')}>
                        <div className="space-y-5">
                            <h1 className="font-bold">📄 Preview</h1>
                            <span className="text-xs">Changes the Mpad view to preview-only.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleLayout('default')}>
                        <div className="space-y-5">
                            <h1 className="font-bold">✏️📄 Editor+Preview</h1>
                            <span className="text-xs">Changes the Mpad view to default.</span>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Themes">
                    <CommandItem onSelect={() => handleTheme('dark')}>
                        <div className="space-y-5">
                            <h1 className="font-bold">🌙 Dark</h1>
                            <span className="text-xs">Changes Mpad to dark mode.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleTheme('light')}>
                        <div className="space-y-5">
                            <h1 className="font-bold">☀️ Light</h1>
                            <span className="text-xs">Changes Mpad to light mode.</span>
                        </div>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
