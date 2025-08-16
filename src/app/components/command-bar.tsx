import { useContext } from 'react';

import { useTheme } from 'next-themes';

import { ApplicationContext } from '@/app/context/context';
import { useFileUpload } from '@/app/hooks/use-file-upload';

import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/app/components/shadcn/command';

export function CommandBar() {
    const { context, setContext } = useContext(ApplicationContext);

    const { setTheme } = useTheme();

    const { handleFileUpload } = useFileUpload();

    const handleFiles = () => {
        setContext({ explorer: true, command: !context.command });
    };

    const handleStorage = () => {
        setContext({ storage: true, command: !context.command });
    };

    const handleUploadCommand = () => {
        handleFileUpload();
        setContext({ command: !context.command });
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
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📁 Explorer</h3>
                            <span className="command-description">{"View this pad's file structure."}</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleUploadCommand()}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📤 Upload File</h3>
                            <span className="command-description">Upload files to this pad (max 5MB, 5 files)</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleStorage()}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">🗄️ Storage</h3>
                            <span className="command-description">View uploaded files in this pad</span>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Layout">
                    <CommandItem onSelect={() => handleLayout('editor')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">✏️ Editor</h3>
                            <span className="command-description">Changes the Mpad view to edit-only.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleLayout('preview')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">📄 Preview</h3>
                            <span className="command-description">Changes the Mpad view to preview-only.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleLayout('default')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">✏️📄 Editor+Preview</h3>
                            <span className="command-description">Changes the Mpad view to default.</span>
                        </div>
                    </CommandItem>
                </CommandGroup>

                <CommandGroup heading="Themes">
                    <CommandItem onSelect={() => handleTheme('dark')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">🌙 Dark</h3>
                            <span className="command-description">Changes Mpad to dark mode.</span>
                        </div>
                    </CommandItem>

                    <CommandItem onSelect={() => handleTheme('light')}>
                        <div className="command-item-spacing">
                            <h3 className="command-heading">☀️ Light</h3>
                            <span className="command-description">Changes Mpad to light mode.</span>
                        </div>
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
